/* =====================================================================
   RENDER GERAL — recalcula indicadores e redesenha a tela
   ===================================================================== */

/* ---------- render geral ---------- */
function render() {
  const cnt = { livre: 0, reservado: 0, pago: 0 };
  all.forEach(n => { cnt[statusOf(n)]++; updateCell(n); });
  const vendidos = cnt.reservado + cnt.pago;
  const pct = Math.round((vendidos / RIFA.total) * 100);

  const meter = $('meter');
  meter.setAttribute('aria-label', `${cnt.pago} pagos, ${cnt.reservado} reservados e ${cnt.livre} livres`);
  meter.innerHTML = `<i class="m-paid" style="width:${cnt.pago / RIFA.total * 100}%"></i><i class="m-res" style="width:${cnt.reservado / RIFA.total * 100}%"></i>`;
  $('meterText').innerHTML = `<span><b>${vendidos}</b> de ${RIFA.total} números vendidos</span><span><b>${pct}%</b> da rifa</span>`;

  $('stats').innerHTML = `
    <div class="stat"><div class="stat-label"><span class="sw"></span>Livres</div><div class="stat-value">${cnt.livre}</div><div class="stat-note">${brl.format(cnt.livre * RIFA.valor)} em jogo</div></div>
    <div class="stat"><div class="stat-label"><span class="sw res"></span>Reservados</div><div class="stat-value">${cnt.reservado}</div><div class="stat-note">${brl.format(cnt.reservado * RIFA.valor)} a receber</div></div>
    <div class="stat"><div class="stat-label"><span class="sw pago"></span>Pagos</div><div class="stat-value">${cnt.pago}</div><div class="stat-note">números quitados</div></div>
    <div class="stat"><div class="stat-label">Arrecadado</div><div class="stat-value">${brl.format(cnt.pago * RIFA.valor)}</div><div class="stat-note">de ${brl.format(vendidos * RIFA.valor)} vendidos</div></div>`;

  chipN.todos.textContent = RIFA.total; chipN.livre.textContent = cnt.livre;
  chipN.reservado.textContent = cnt.reservado; chipN.pago.textContent = cnt.pago;

  const people = buildPeople();
  $('tabCount').textContent = people.length;
  $('pStats').innerHTML = `
    <div class="stat"><div class="stat-label">Participantes</div><div class="stat-value">${people.length}</div><div class="stat-note">${plural(vendidos, 'número vendido', 'números vendidos')}</div></div>
    <div class="stat"><div class="stat-label">Recebido</div><div class="stat-value">${brl.format(cnt.pago * RIFA.valor)}</div><div class="stat-note">${plural(cnt.pago, 'número pago', 'números pagos')}</div></div>
    <div class="stat"><div class="stat-label">A receber</div><div class="stat-value">${brl.format(cnt.reservado * RIFA.valor)}</div><div class="stat-note">${plural(cnt.reservado, 'número pendente', 'números pendentes')}</div></div>`;

  renderPeople(); renderFound(); applyFilters();
}
