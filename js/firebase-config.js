/* =====================================================================
   FIREBASE — chaves do projeto
   Estas chaves podem ficar no GitHub: quem protege os dados são o login
   e as regras do Firestore (veja firestore.rules e o README).
   ===================================================================== */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBJiKxp_nbMX2IidWib0ljUTbirl2qgtxk",
  authDomain: "ficacasamento.firebaseapp.com",
  projectId: "ficacasamento",
  storageBucket: "ficacasamento.firebasestorage.app",
  messagingSenderId: "874378170598",
  appId: "1:874378170598:web:b8646047176dfcaa532b27"
};

/* Onde as vendas ficam no banco */
const COLECAO_VENDAS = 'rifa_vendas';     // um documento por número (001, 002…)
const DOC_META = 'rifa_meta/config';      // marca se a carga inicial já foi feita
