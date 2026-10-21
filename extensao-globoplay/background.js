// Repassa os vereditos da página de checagem para todas as abas da Globo abertas.
const GLOBO = ["https://*.globo.com/*"];

chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  chrome.tabs.query({ url: GLOBO }, async (tabs) => {
    let ok = 0;
    for (const t of tabs) {
      try { await chrome.tabs.sendMessage(t.id, msg); ok++; } catch { /* aba aberta antes da extensão: precisa recarregar */ }
    }
    reply({ abas: ok });
  });
  return true; // resposta assíncrona
});
