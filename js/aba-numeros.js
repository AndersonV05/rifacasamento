/* =====================================================================
   ABA NÚMEROS — filtros, grade de números e busca rápida
   ===================================================================== */

/* ---------- chips ---------- */
function makeChips(boxId, items, onPick) {
  const refs = {};
  items.forEach(([key, label]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.dataset.f = key;
    b.innerHTML = `${label} <span class="n"></span>`;
    refs[key] = b.querySelector('.n');
    b.addEventListener('click', () => onPick(key));
    $(boxId).appendChild(b);
  });
  return refs;
}
const chipN = makeChips('chips', [['todos', 'Todos'], ['livre', 'Livres'], ['reservado', 'Reservados'], ['pago', 'Pagos']], k => { state.filter = k; applyFilters(); });

/* ---------- grade ---------- */
const STATUS_LABEL = { livre: 'livre', reservado: 'reservado, aguardando pagamento', pago: 'pago' };
const cells = new Map();
all.forEach(n => {
  const b = document.createElement('button');
  b.type = 'button'; b.dataset.n = n;
  b.addEventListener('click', () => openEditor(n));
  b.addEventListener('mouseenter', () => showDetail(n));
  b.addEventListener('focus', () => showDetail(n));
  $('grid').appendChild(b);
  cells.set(n, b);
});
function updateCell(n) {
  const b = cells.get(n), st = statusOf(n), s = sales.get(n);
  b.className = 'cell ' + st;
  b.setAttribute('aria-label', `Número ${pad(n)}, ${STATUS_LABEL[st]}${s ? ', ' + s.nome + (s.pago && s.forma ? ', pago no ' + s.forma : '') : ''}. Toque para editar.`);
  b.innerHTML = `<span class="num">${pad(n)}</span>` + (s ? `<span class="who"></span><span class="ico">${st === 'pago' ? ICON.check : ICON.clock}</span>` : '');
  if (s) b.querySelector('.who').textContent = firstName(s.nome);
}
function payText(s) { return s.pago ? 'pago' + (s.forma ? ' no ' + (s.forma === 'Pix' ? 'Pix' : 'dinheiro (espécie)') : '') : 'ainda não pagou'; }
function showDetail(n) {
  const s = sales.get(n), d = $('detail');
  d.textContent = '';
  const strong = document.createElement('b'); strong.textContent = 'Nº ' + pad(n);
  d.appendChild(strong);
  d.appendChild(document.createTextNode(s ? ` — ${s.nome} · ${payText(s)} · vendido em ${fmtDate(s.data)}` : ' — livre. Toque para registrar a venda.'));
}
$('detail').textContent = 'Passe o mouse ou toque em um número para ver os detalhes.';

function matchesQuery(n, q) {
  const s = sales.get(n);
  if (/^\d+$/.test(q) && String(n).startsWith(q.replace(/^0+/, '') || '0')) return true;
  return s ? norm(s.nome).includes(q) : false;
}
function applyFilters() {
  const q = norm(state.q);
  let shown = 0;
  all.forEach(n => {
    const ok = (state.filter === 'todos' || state.filter === statusOf(n)) && (!q || matchesQuery(n, q));
    cells.get(n).hidden = !ok;
    if (ok) shown++;
  });
  document.querySelectorAll('#chips .chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.f === state.filter));
  $('empty').hidden = shown > 0;
  $('grid').hidden = shown === 0;
}
$('q').addEventListener('input', e => { state.q = e.target.value; renderFound(); applyFilters(); });
$('resetFilters').addEventListener('click', () => { state.q = ''; state.filter = 'todos'; $('q').value = ''; renderFound(); applyFilters(); });

/* ---------- resultado rápido da busca (aba Números) ---------- */
function renderFound() {
  const q = norm(state.q), box = $('found');
  box.innerHTML = '';
  if (!q) { box.hidden = true; return; }
  const isNum = /^\d+$/.test(q), qn = q.replace(/^0+/, '') || '0';
  const list = buildPeople().filter(p => norm(p.nome).includes(q) || (isNum && p.list.some(s => String(s.n).startsWith(qn))))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  box.hidden = false;
  if (!list.length) {
    const d = document.createElement('div'); d.className = 'found-none';
    d.textContent = isNum ? 'Nenhuma venda registrada para esse número.' : 'Nenhuma pessoa encontrada com esse nome.';
    box.appendChild(d); return;
  }
  list.slice(0, 4).forEach(p => {
    const info = pinfo(p);
    const row = document.createElement('div'); row.className = 'found-row';
    const n = document.createElement('div'); n.className = 'who-n'; n.textContent = p.nome;
    const nums = numTags(p.list); nums.classList.add('nums');
    const st = badge(info.status);
    if (info.formas.length) st.textContent += ' · ' + info.formas.join(' e ');
    row.append(avatar(p.nome, true), n, nums, st);
    box.appendChild(row);
  });
  if (list.length > 4) {
    const more = document.createElement('button'); more.type = 'button'; more.className = 'found-more';
    more.textContent = `Ver mais ${list.length - 4} em Participantes`;
    more.addEventListener('click', () => { state.pq = state.q; $('pq').value = state.q; showTab('ppl'); renderPeople(); });
    box.appendChild(more);
  }
}
