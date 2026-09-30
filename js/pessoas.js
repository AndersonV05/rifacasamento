/* =====================================================================
   PESSOAS — agrupa vendas por pessoa e cria avatar, selo e etiquetas
   ===================================================================== */

/* ---------- pessoas ---------- */
function buildPeople() {
  const g = new Map();
  serialize().forEach(s => {
    const k = norm(s.nome);
    if (!g.has(k)) g.set(k, { key: k, nome: s.nome, list: [] });
    g.get(k).list.push(s);
  });
  return [...g.values()];
}
function pinfo(p) {
  const paid = p.list.filter(s => s.pago).length, open = p.list.length - paid;
  const formas = [...new Set(p.list.filter(s => s.pago && s.forma).map(s => s.forma))];
  return { paid, open, formas, status: open === 0 ? 'ok' : (paid ? 'part' : 'pend') };
}
const canon = nome => {
  const clean = nome.replace(/\s+/g, ' ').trim();
  const hit = [...sales.values()].find(s => norm(s.nome) === norm(clean));
  return hit ? hit.nome : clean;
};
const firstName = nome => {
  const w = nome.split(/[\s(]+/).filter(Boolean);
  return (/^(vov[óo]|irm[ãa]o?|tia|titia|tio)$/i.test(w[0]) && w[1]) ? w[0] + ' ' + w[1] : w[0];
};
function avatar(nome, small) {
  const words = nome.split(/\s+/).filter(w => !w.startsWith('(') && /\p{L}/u.test(w));
  const ini = ((words[0] || nome)[0] + (words[1] ? words[1][0] : '')).toUpperCase();
  let hsh = 0; for (const c of norm(nome)) hsh = (hsh * 31 + c.charCodeAt(0)) % 360;
  const el = document.createElement('span');
  el.className = 'av' + (small ? ' sm' : ''); el.style.setProperty('--h', hsh); el.textContent = ini; el.setAttribute('aria-hidden', 'true');
  return el;
}
const BADGE = { ok: 'Quitado', part: 'Parcial', pend: 'Pendente' };
function badge(st) { const b = document.createElement('span'); b.className = 'badge ' + st; b.textContent = BADGE[st]; return b; }
function numTags(list) {
  const wrap = document.createElement('div'); wrap.className = 'tags';
  list.forEach(s => {
    const t = document.createElement('button'); t.type = 'button'; t.className = 'tag ' + (s.pago ? 'pago' : 'res');
    t.innerHTML = s.pago ? ICON.check : ICON.clock;
    t.appendChild(document.createTextNode(pad(s.n)));
    if (s.pago && s.forma) { const f = document.createElement('span'); f.className = 'fm'; f.textContent = '· ' + s.forma; t.appendChild(f); }
    t.title = 'Editar número ' + pad(s.n);
    t.addEventListener('click', () => openEditor(s.n));
    wrap.appendChild(t);
  });
  return wrap;
}
