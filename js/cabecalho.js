/* =====================================================================
   CABEÇALHO E ABAS — preenche o topo com RIFA e troca de aba
   ===================================================================== */

/* ---------- cabeçalho ---------- */
document.title = RIFA.titulo;
$('brandTitle').textContent = RIFA.titulo;
$('titulo').textContent = RIFA.titulo;
$('range').textContent = `Números de ${pad(1)} a ${pad(RIFA.total)}`;
$('priceVal').textContent = RIFA.valor;
const hero = $('heroCopy');
if (RIFA.premio) {
  hero.className = 'prize';
  const s = document.createElement('strong'); s.textContent = 'Prêmio: ' + RIFA.premio; hero.appendChild(s);
  if (RIFA.descricaoPremio) { const p = document.createElement('span'); p.textContent = RIFA.descricaoPremio; hero.appendChild(p); }
} else {
  const p = document.createElement('p'); p.className = 'tagline'; p.textContent = 'Acompanhe os números vendidos e os pagamentos.'; hero.appendChild(p);
}
$('drawText').textContent = RIFA.dataSorteio
  ? new Date(RIFA.dataSorteio + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
  : 'Data a definir';
$('footer').innerHTML = RIFA.organizador ? 'Organização: <b></b>' : '';
if (RIFA.organizador) $('footer').querySelector('b').textContent = RIFA.organizador;

/* ---------- abas ---------- */
function showTab(which) {
  ['num', 'ppl', 'cfg'].forEach(k => {
    $('panel-' + k).hidden = which !== k;
    $('tab-' + k).setAttribute('aria-selected', which === k);
  });
  window.scrollTo(0, 0);
}
$('tab-num').addEventListener('click', () => showTab('num'));
$('tab-ppl').addEventListener('click', () => showTab('ppl'));
$('tab-cfg').addEventListener('click', () => showTab('cfg'));
