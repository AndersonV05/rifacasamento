# Grande Rifa

Site simples para controlar as vendas e os pagamentos de uma rifa.
É um site estático (HTML + CSS + JavaScript puro): não precisa instalar nada.

## Estrutura

```
.
├── index.html                 Página principal (só a estrutura)
├── firestore.rules            Regras de segurança (colar no Firebase)
├── css/
│   ├── variables.css          Cores, fontes e tema escuro
│   ├── base.css               Layout geral, barra superior, busca e filtros, rodapé
│   ├── ticket.css             Bilhete do topo e cartões de resumo
│   ├── numeros.css            Aba Números (grade de números)
│   ├── componentes.css        Avatares, etiquetas, selos e tabela
│   ├── janelas.css            Pop-ups de edição e aba Configurações
│   ├── login.css              Tela de login e botão Sair
│   └── responsivo.css         Ajustes para tablet e celular
└── js/
    ├── config.js              ⭐ Título, valor do número, total, data do sorteio
    ├── firebase-config.js     ⭐ Chaves do Firebase (já preenchidas)
    ├── vendas.js              Carga inicial (enviada ao banco 1 única vez)
    ├── utils.js               Funções pequenas (formatar moeda, data, etc.)
    ├── dados.js               Vendas em memória e estado dos filtros
    ├── armazenamento.js       Login Google + banco Firestore (tempo real)
    ├── pessoas.js             Agrupar vendas por pessoa, avatar, selos
    ├── cabecalho.js           Preenche o topo e troca de aba
    ├── aba-numeros.js         Grade de números, filtros e busca
    ├── aba-participantes.js   Tabela de participantes
    ├── render.js              Recalcula os indicadores e redesenha a tela
    ├── editor.js              Janela de editar número / marcar tudo como pago
    ├── aba-configuracoes.js   Exportar e importar backup
    └── main.js                Ponto de partida
```

## O que editar (casos mais comuns)

| Quero…                                   | Arquivo                 |
| ---------------------------------------- | ----------------------- |
| Mudar título, prêmio, valor, total, data | `js/config.js`          |
| Mudar quem pode acessar                  | `firestore.rules` (e colar no Firebase) |
| Mudar cores / fontes / tema escuro       | `css/variables.css`     |
| Mudar textos das abas ou janelas         | `index.html`            |
| Mudar o visual no celular                | `css/responsivo.css`    |

Formato de cada venda em `vendas.js`:
`[número, 'Nome', pago (1 ou 0), 'AAAA-MM-DD', 'Pix' | 'Espécie' | null]`

## Banco de dados (Firebase) — configuração

Os dados ficam no **Firestore** e aparecem em tempo real para todos os usuários autorizados.
O acesso é por **login com Google**, só para os e-mails que você liberar.

Faça uma vez só, em https://console.firebase.google.com (projeto `ficacasamento`):

1. **Build → Authentication → Get started → Sign-in method → Google → Ativar** (escolha um e-mail de suporte).
2. **Authentication → Settings → Authorized domains → Add domain:** `SEU-USUARIO.github.io`
   (`localhost` já vem liberado).
3. **Build → Firestore Database → Create database** (modo produção; região `southamerica-east1` se aparecer).
4. **Firestore → Rules:** cole o conteúdo de `firestore.rules`, **troque os e-mails pelos autorizados** e clique em *Publish*.

Na primeira vez que um e-mail autorizado entrar, o site envia a lista de `js/vendas.js` para o banco
(carga inicial, feita uma única vez). Depois disso **o banco é a fonte dos dados**: editar `vendas.js` não muda nada.
Com o banco povoado, deixe `const VENDAS = [];` no repositório para não expor nomes no GitHub.

Para liberar mais uma pessoa: adicione o e-mail dela em `firestore.rules` e publique de novo no Firebase.

> ⚠️ Nunca deixe as regras como `allow read, write: if true;` — qualquer pessoa com o link poderia apagar tudo.

**Backup:** o Firebase não faz cópia automática neste plano gratuito. Use *Configurações → Exportar backup (.json)*
de vez em quando.

## Rodar no computador

O login com Google **não funciona abrindo o arquivo com dois cliques** (`file://`). Use um servidor local:

```bash
python3 -m http.server 8000
```

e abra http://localhost:8000.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (sem README, para não dar conflito).
2. Na pasta do projeto:

   ```bash
   git init
   git add .
   git commit -m "Primeira versão da Grande Rifa"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```

3. No GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**,
   escolha `main` e `/ (root)` e salve.
4. Em alguns minutos o site fica em `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`.

## ⚠️ Privacidade

O login e as regras do Firestore protegem as vendas no banco. Já o `js/vendas.js` (carga inicial) fica legível
no GitHub se o repositório for **público**. Depois da carga inicial, esvazie a lista (`const VENDAS = [];`).
