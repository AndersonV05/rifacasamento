/* =====================================================================
   UTILITÁRIOS — funções pequenas usadas no site todo
   ===================================================================== */

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const pad = n => String(n).padStart(3, '0');
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const fmtDate = iso => iso.split('-').reverse().join('/');
const $ = id => document.getElementById(id);
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const plural = (n, a, b) => `${n} ${n === 1 ? a : b}`;

const ICON = {
  check: '<svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M2.2 6.4l2.6 2.6 5-5.6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clock: '<svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 3.4V6l1.8 1.1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
};
