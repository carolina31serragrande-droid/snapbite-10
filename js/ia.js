// ============================================================
//  SnapBite IA — Respostas locais (sem API)
// ============================================================

const respostas = [
  {
    palavras: ['mais pedido', 'popular', 'favorito', 'campeão'],
    resposta: '🏆 O lanche mais pedido aqui é o X-Burguer! Vai muito bem com um suco gelado.'
  },
  {
    palavras: ['combo', 'barato', 'econômico', 'promoção'],
    resposta: '💰 Temos combos com lanche + bebida por um preço bem em conta! Pergunta no balcão as opções do dia.'
  },
  {
    palavras: ['bebida', 'suco', 'refrigerante', 'água', 'drink'],
    resposta: '🥤 Temos sucos naturais, refrigerantes e água. Suco de laranja combina muito com qualquer lanche!'
  },
  {
    palavras: ['horário', 'hora', 'funciona', 'abre', 'fecha', 'quando'],
    resposta: '🕐 Funcionamos em dois turnos:\n• Manhã: 07:00 às 08:30\n• Tarde: 11:00 às 12:30'
  },
  {
    palavras: ['hambúrguer', 'burger', 'x-burguer', 'lanche'],
    resposta: '🍔 Nossos hambúrgueres são feitos na hora! O X-Burguer e o X-Salada são os queridinhos da galera.'
  },
  {
    palavras: ['pizza', 'esfirra', 'coxinha', 'pastel', 'salgado'],
    resposta: '🥐 Temos salgados variados todos os dias. A disponibilidade pode mudar, então vale conferir no balcão!'
  },
  {
    palavras: ['preço', 'quanto', 'custa', 'valor'],
    resposta: '💵 Os preços variam por produto. Consulte o cardápio no site ou pergunte direto no balcão!'
  },
  {
    palavras: ['cardápio', 'menu', 'opções', 'tem o que', 'o que tem'],
    resposta: '📋 Acesse a aba Cardápio no site pra ver tudo disponível hoje!'
  },
  {
    palavras: ['pagar', 'pagamento', 'pix', 'cartão', 'dinheiro'],
    resposta: '💳 Aceitamos Pix, cartão e dinheiro. Facilidade total pra você!'
  },
  {
    palavras: ['oi', 'olá', 'ola', 'ei', 'eai', 'e aí', 'bom dia', 'boa tarde'],
    resposta: '👋 Olá! Sou a IA do SnapBite. Posso te ajudar com lanches, combos, horários e muito mais. O que você precisa?'
  },
  {
    palavras: ['obrigado', 'obrigada', 'valeu', 'brigado', 'thanks'],
    resposta: '😊 De nada! Qualquer dúvida é só perguntar. Bom lanche!'
  },
  {
    palavras: ['tchau', 'até', 'flw', 'falou'],
    resposta: '👋 Até mais! Aproveite seu lanche no SnapBite! 🍔'
  }
];

const respostaPadrao = '🤔 Não entendi bem sua pergunta. Você pode perguntar sobre lanches, combos, horários, bebidas ou preços!';

function encontrarResposta(texto) {
  const lower = texto.toLowerCase();
  for (const item of respostas) {
    if (item.palavras.some(p => lower.includes(p))) {
      return item.resposta;
    }
  }
  return respostaPadrao;
}

// ── Utilitários de UI ───────────────────────────────────────

function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

function criarMensagem(tipo, texto) {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;

  const msg = document.createElement('div');
  msg.className = `msg ${tipo === 'user' ? 'msg-user' : 'msg-ia'}`;
  msg.innerHTML = `
    <div class="msg-avatar">${tipo === 'user' ? '🧑' : '🤖'}</div>
    <div class="msg-bubble">${escaparHTML(texto)}</div>
  `;

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function responderIA(texto) {
  criarMensagem('user', texto);

  setTimeout(() => {
    const resposta = encontrarResposta(texto);
    criarMensagem('ia', resposta);
  }, 400);
}

// ── Inicialização ───────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const form  = document.getElementById('ia-form');
  const input = document.getElementById('ia-input');
  const btn   = document.getElementById('btn-enviar-ia');

  function enviar() {
    const texto = input.value.trim();
    if (!texto) return;
    responderIA(texto);
    input.value = '';
  }

  form?.addEventListener('submit', (e) => e.preventDefault());
  btn?.addEventListener('click', enviar);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); enviar(); }
  });

  document.querySelectorAll('.sugestao-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.dataset.msg;
      if (msg) responderIA(msg);
    });
  });
});