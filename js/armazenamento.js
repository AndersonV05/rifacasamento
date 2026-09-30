/* =====================================================================
   ARMAZENAMENTO — login (Google) e banco de dados (Firestore)
   - Cada venda é um documento em  rifa_vendas/{número}.
   - A tela é atualizada em tempo real quando outra pessoa altera algo.
   - O resto do site só chama  persist()  depois de mudar  sales;
     aqui descobrimos o que mudou e enviamos só essas diferenças.
   ===================================================================== */
let fbAuth = null, fbDb = null, unsubscribe = null, seeding = false, loginNote = '';
const remote = new Map();                       // n -> assinatura do que está no banco

const toDoc = s => ({ n: s.n, nome: s.nome, pago: !!s.pago, data: s.data, forma: s.forma || null });
const sig = s => JSON.stringify(toDoc(s));
const docRef = n => fbDb.collection(COLECAO_VENDAS).doc(pad(n));

function setSave(msg, kind) {
  const el = $('saveStatus');
  el.textContent = msg;
  el.className = 'save' + (kind ? ' ' + kind : '');
  el.title = kind === 'err' ? 'Não foi possível salvar. Tente de novo.' : 'As alterações são salvas no banco e aparecem para todos.';
}
function showLogin(msg) { $('login').hidden = false; $('loginMsg').textContent = msg || ''; }
function hideLogin() { $('login').hidden = true; }

/* ---------- início ---------- */
function initStore() {
  if (typeof firebase === 'undefined') {
    setSave('Sem conexão', 'err');
    showLogin('Não foi possível carregar o Firebase. Verifique a internet e recarregue a página.');
    return;
  }
  firebase.initializeApp(FIREBASE_CONFIG);
  fbAuth = firebase.auth();
  fbDb = firebase.firestore();
  $('btnLogin').addEventListener('click', entrar);
  $('btnSair').addEventListener('click', () => fbAuth.signOut());
  fbAuth.onAuthStateChanged(user => user ? iniciarSync(user) : pararSync());
  fbAuth.getRedirectResult().catch(() => {});
}

/* ---------- login ---------- */
function entrar() {
  $('loginMsg').textContent = '';
  const provider = new firebase.auth.GoogleAuthProvider();
  fbAuth.signInWithPopup(provider).catch(e => {
    if (e.code === 'auth/popup-blocked') return fbAuth.signInWithRedirect(provider);
    if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') return;
    const dica = e.code === 'auth/unauthorized-domain' ? ' Este endereço ainda não foi autorizado no Firebase (Authentication → Settings → Authorized domains).' : '';
    showLogin('Não foi possível entrar (' + (e.code || 'erro') + ').' + dica);
  });
}

/* ---------- sincronização em tempo real ---------- */
function iniciarSync(user) {
  hideLogin();
  $('btnSair').hidden = false; $('btnSair').title = 'Conectado como ' + user.email;
  setSave('Carregando…', 'busy');
  unsubscribe = fbDb.collection(COLECAO_VENDAS).onSnapshot(async snap => {
    remote.clear();
    const list = [];
    snap.forEach(d => { const s = d.data(); remote.set(s.n, sig(s)); list.push(s); });

    if (snap.empty && !snap.metadata.fromCache && !seeding) {       // banco vazio: talvez seja a 1ª vez
      seeding = true;
      try { if (await semearSeNecessario()) return; }                // vai disparar outro snapshot
      catch (e) { return erroBanco(e); }
      finally { seeding = false; }
    }
    loadFrom(list);
    ready = true;
    setSave('Salvo');
    render();
  }, erroBanco);
}

/* Carga inicial: envia VENDAS (vendas.js) ao banco, uma única vez. */
async function semearSeNecessario() {
  const meta = await fbDb.doc(DOC_META).get();
  if (meta.exists) return false;
  const batch = fbDb.batch();
  VENDAS.forEach(v => batch.set(docRef(v[0]), toDoc({ n: v[0], nome: v[1], pago: v[2], data: v[3], forma: v[4] })));
  batch.set(fbDb.doc(DOC_META), { semeado: true, em: new Date().toISOString() });
  await batch.commit();
  return VENDAS.length > 0;
}

function erroBanco(e) {
  if (e && e.code === 'permission-denied') {
    const quem = fbAuth.currentUser ? fbAuth.currentUser.email : 'Esta conta';
    loginNote = quem + ' não tem permissão para acessar. Entre com outra conta.';
    fbAuth.signOut();
  } else {
    setSave('Erro de conexão', 'err');
  }
}

function pararSync() {
  if (unsubscribe) { unsubscribe(); unsubscribe = null; }
  ready = false; remote.clear(); loadFrom([]); render();
  $('btnSair').hidden = true;
  setSave('Entre para continuar', 'busy');
  showLogin(loginNote); loginNote = '';
}

/* ---------- salvar ---------- */
async function persist() {
  if (!fbDb) return;
  setSave('Salvando…', 'busy');
  try {
    const batch = fbDb.batch(); let ops = 0;
    sales.forEach(s => { if (remote.get(s.n) !== sig(s)) { batch.set(docRef(s.n), toDoc(s)); ops++; } });
    remote.forEach((_, n) => { if (!sales.has(n)) { batch.delete(docRef(n)); ops++; } });
    if (ops) await batch.commit();
    setSave('Salvo');
  } catch (e) {
    setSave(e && e.code === 'permission-denied' ? 'Sem permissão' : 'Erro ao salvar', 'err');
  }
}
