// Roda na página de checagem (localhost:8787) e leva cada veredito para a extensão.
function send(msg) {
  try {
    chrome.runtime.sendMessage(msg, (r) => {
      if (chrome.runtime.lastError) return;
      window.postMessage({ __checagemResp: 1, abas: r ? r.abas : 0 }, location.origin);
    });
  } catch { /* extensão recarregada: recarregue esta página */ }
}

window.addEventListener("message", (e) => {
  if (e.source !== window || !e.data || e.data.__checagem !== 1) return;
  send({ tipo: "veredito", veredito: e.data.veredito, estilo: e.data.estilo });
});

// Mantém o status "Globoplay conectada" atualizado na página.
send({ tipo: "ping" });
setInterval(() => send({ tipo: "ping" }), 5000);
