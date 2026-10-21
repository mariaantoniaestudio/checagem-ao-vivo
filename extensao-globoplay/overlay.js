// Roda na aba da Globoplay: desenha o duotone e a tarja com a fonte por cima do vídeo.
(() => {
  const host = document.createElement("div");
  host.id = "checagem-ao-vivo";
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;pointer-events:none;";
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `
<style>
  :host{all:initial}
  .tint{opacity:0;transition:opacity .45s ease}
  .frame{position:fixed;inset:0;border:0 solid transparent;transition:border-width .3s ease}
  [data-estilo=tinta] .tint{position:fixed;inset:0}
  [data-estilo=tinta][data-state=falso] .tint{background:#ff2a40;opacity:.42}
  [data-estilo=tinta][data-state=verdadeiro] .tint{background:#18d873;opacity:.38}
  [data-state=falso] .frame{border-width:10px;border-color:#ff3b4e}
  [data-state=verdadeiro] .frame{border-width:10px;border-color:#2fe383}
  .verdict{position:fixed;left:4vw;right:4vw;bottom:7vh;display:flex;font:14px/1.3 -apple-system,"Helvetica Neue",Arial,sans-serif;
    opacity:0;transform:translateY(16px);transition:opacity .35s ease,transform .35s cubic-bezier(.2,.8,.2,1)}
  [data-state=falso] .verdict,[data-state=verdadeiro] .verdict{opacity:1;transform:none}
  .tag{flex:none;display:grid;place-items:center;padding:0 2.2vw;font-weight:800;letter-spacing:.06em;font-size:clamp(16px,2.2vw,40px)}
  [data-state=falso] .tag{background:#ff3b4e;color:#fff}
  [data-state=verdadeiro] .tag{background:#2fe383;color:#03170b}
  .body{flex:1;min-width:0;background:rgba(8,9,12,.92);color:#eef0f4;padding:1.1vw 1.5vw}
  .claim{margin:0 0 .4vw;font-size:clamp(14px,1.6vw,28px);font-weight:600}
  .why{margin:0 0 .5vw;font-size:clamp(12px,1.05vw,18px);color:#a5abb8}
  .src{font-size:clamp(12px,1vw,17px);color:#a5abb8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .src b{color:#eef0f4}
</style>
<div class="wrap" data-state="neutro" data-estilo="duotone">
  <div class="tint"></div><div class="frame"></div>
  <div class="verdict"><div class="tag"></div><div class="body"><p class="claim"></p><p class="why"></p><div class="src"></div></div></div>
</div>`;
  const wrap = root.querySelector(".wrap");
  const $ = (s) => root.querySelector(s);

  // As duas camadas do duotone ficam soltas na página (fora do shadow root), senão a mistura
  // de cores só enxergaria a própria camada e não o vídeo por baixo.
  const layer = (blend) => {
    const d = document.createElement("div");
    d.style.cssText = `position:fixed;inset:0;z-index:2147483646;pointer-events:none;opacity:0;` +
      `transition:opacity .45s ease;mix-blend-mode:${blend};`;
    return d;
  };
  const light = layer("multiply");
  const dark = layer("screen");
  const COLORS = { falso: ["#ff3b4e", "#3a0008"], verdadeiro: ["#2fe383", "#002713"] };

  // Em tela cheia só aparece o que está dentro do elemento em tela cheia: muda as camadas de lugar.
  const place = () => {
    const parent = document.fullscreenElement || document.documentElement;
    parent.append(light, dark, host);
  };
  document.addEventListener("fullscreenchange", place);
  place();

  // O duotone deixa o vídeo em preto e branco por baixo das camadas de cor.
  const setDuotone = (state) => {
    const on = !!COLORS[state];
    if (on) { light.style.background = COLORS[state][0]; dark.style.background = COLORS[state][1]; }
    light.style.opacity = dark.style.opacity = on ? "1" : "0";
    for (const v of document.querySelectorAll("video"))
      v.style.filter = on ? "grayscale(1) contrast(1.25) brightness(1.08)" : "";
  };

  function show(v, estilo) {
    estilo = estilo === "tinta" ? "tinta" : "duotone";
    wrap.dataset.estilo = estilo;
    if (!v || (v.veredito !== "verdadeiro" && v.veredito !== "falso")) {
      wrap.dataset.state = "neutro";
      setDuotone(null);
      return;
    }
    $(".tag").textContent = v.veredito === "verdadeiro" ? "VERDADEIRO" : "FALSO";
    $(".claim").textContent = `“${v.afirmacao || ""}”`;
    $(".why").textContent = v.resumo || "";
    const src = $(".src");
    src.replaceChildren();
    if (v.fonte) {
      src.append("Fonte: ");
      const b = document.createElement("b"); b.textContent = v.fonte.veiculo || ""; src.append(b);
      if (v.fonte.titulo) src.append(` · ${v.fonte.titulo}`);
      if (v.fonte.data) src.append(` · ${v.fonte.data}`);
    }
    wrap.dataset.state = v.veredito;
    place();
    setDuotone(estilo === "duotone" ? v.veredito : null);
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.tipo === "veredito") show(msg.veredito, msg.estilo);
  });
})();
