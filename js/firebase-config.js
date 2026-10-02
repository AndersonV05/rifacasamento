/* =====================================================================
   FIREBASE — chaves do projeto
   Estas chaves podem ficar no GitHub: quem protege os dados são o login
   e as regras do Firestore (veja firestore.rules e o README).
   ===================================================================== */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBIgqWBqaJX_xQGEZVITvPD3OMRkUwtbb8",
  authDomain: "rifacasamento-60505.firebaseapp.com",
  projectId: "rifacasamento-60505",
  storageBucket: "rifacasamento-60505.firebasestorage.app",
  messagingSenderId: "1078045405899",
  appId: "1:1078045405899:web:83602bc9cc77f0e8d6e14e"
};

/* Onde as vendas ficam no banco */
const COLECAO_VENDAS = 'rifa_vendas';     // um documento por número (001, 002…)
const DOC_META = 'rifa_meta/config';      // marca se a carga inicial já foi feita
