/* =====================================================================
   EDITOR — janela de editar número e de marcar tudo como pago
   ===================================================================== */

/* ---------- editor de número ---------- */
let editing = null, payVal = 'none', delArmed = false;
function setPay(v) { payVal = v; document.querySelectorAll('#edPay button').forEach(b => b.setAttribute('aria-checked', b.dataset.v === v)); }
document.querySelectorAll('#edPay button').forEach(b => b.addEventListener('click', () => setPay(b.dataset.v)));
function resetDel() { delArmed = false; const d = $('edDel'); d.classList.remove('sure'); d.textContent = 'Remover venda'; }

function updateNameUI() {
  const v = $('edName').value, q = norm(v), hint = $('nameHint'), box = $('sugg');
  const people = buildPeople().sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  const exact = q && people.find(p => p.key === q);
  if (!q) { hint.textContent = 'Digite um nome novo ou toque em uma pessoa já cadastrada.'; hint.className = 'hint'; }
  else if (exact) { hint.textContent = `✓ ${exact.nome} já está na rifa. Este número será somado a ela.`; hint.className = 'hint exists'; }
  else { hint.textContent = `Novo nome: “${v.replace(/\s+/g, ' ').trim()}” será adicionado como nova pessoa.`; hint.className = 'hint new'; }
  const match = people.filter(p => !q || p.key.includes(q)).slice(0, 60);
  box.innerHTML = '';
  match.forEach(p => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = p.nome;
    b.addEventListener('click', () => { $('edName').value = p.nome; updateNameUI(); $('edName').focus(); });
    box.appendChild(b);
  });
  $('suggTitle').hidden = box.hidden = !match.length;
}
$('edName').addEventListener('input', updateNameUI);

function openEditor(n) {
  if (!ready) { const msg = ultimoErro || 'Aguarde, os dados ainda estão carregando.'; $('detail').textContent = msg; if (ultimoErro) alert(msg); return; }
  editing = n;
  const s = sales.get(n);
  $('edNum').textContent = 'Número ' + pad(n);
  $('edSub').textContent = s ? `Vendido em ${fmtDate(s.data)}` : `Livre · ${brl.format(RIFA.valor)}`;
  $('edName').value = s ? s.nome : '';
  $('edDate').value = s ? s.data : todayISO();
  setPay(s ? (s.pago ? (s.forma || 'Pix') : 'none') : 'none');
  $('edErr').textContent = '';
  $('edDel').hidden = !s; resetDel();
  updateNameUI();
  $('dlg').showModal();
  $('edName').focus();
  if (!s) $('edName').select();
}
function closeEditor() { $('dlg').close(); editing = null; }
function saveEditor() {
  const nome = canon($('edName').value);
  if (!nome) { $('edErr').textContent = 'Digite o nome de quem ficou com o número.'; $('edName').focus(); return; }
  const prev = sales.get(editing), pago = payVal !== 'none';
  const data = $('edDate').value || (prev ? prev.data : todayISO());
  sales.set(editing, { n: editing, nome, pago, forma: pago ? payVal : null, data });
  const n = editing;
  closeEditor(); render(); showDetail(n); persist();
}
$('edSave').addEventListener('click', saveEditor);
$('edCancel').addEventListener('click', closeEditor);
$('edName').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); saveEditor(); } });
$('edDel').addEventListener('click', () => {
  if (!delArmed) { delArmed = true; $('edDel').classList.add('sure'); $('edDel').textContent = 'Confirmar remoção'; setTimeout(() => { if ($('dlg').open) resetDel(); }, 4000); return; }
  const n = editing; sales.delete(n);
  closeEditor(); render(); showDetail(n); persist();
});
$('dlg').addEventListener('click', e => { if (e.target === $('dlg')) closeEditor(); });

/* ---------- marcar todos de uma pessoa como pagos ---------- */
let payTarget = null;
function openPayAll(p) {
  if (!ready) return;
  payTarget = p.key;
  const open = p.list.filter(s => !s.pago);
  $('payTitle').textContent = p.nome;
  $('paySub').textContent = `${plural(open.length, 'número pendente', 'números pendentes')} · ${brl.format(open.length * RIFA.valor)}`;
  $('dlgPay').showModal();
}
document.querySelectorAll('#payAllSeg button').forEach(b => b.addEventListener('click', () => {
  sales.forEach(s => { if (norm(s.nome) === payTarget && !s.pago) { s.pago = true; s.forma = b.dataset.v; } });
  $('dlgPay').close(); render(); persist();
}));
$('payCancel').addEventListener('click', () => $('dlgPay').close());
$('dlgPay').addEventListener('click', e => { if (e.target === $('dlgPay')) $('dlgPay').close(); });
