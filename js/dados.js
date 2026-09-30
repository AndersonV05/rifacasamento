/* =====================================================================
   DADOS — vendas em memória, estado dos filtros e lista de números
   ===================================================================== */

/* ---------- dados ---------- */
let sales = new Map();
const loadFrom = list => { sales = new Map(list.map(s => [s.n, { n: s.n, nome: s.nome, pago: !!s.pago, data: s.data, forma: s.forma || null }])); };
/* As vendas chegam do banco (Firebase) depois do login — veja armazenamento.js */
const serialize = () => [...sales.values()].sort((a, b) => a.n - b.n);
const statusOf = n => { const s = sales.get(n); return s ? (s.pago ? 'pago' : 'reservado') : 'livre'; };

const state = { filter: 'todos', q: '', pf: 'todos', pq: '', sort: 'nome' };
const all = [...Array(RIFA.total)].map((_, i) => i + 1);
let ready = false;
