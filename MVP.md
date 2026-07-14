# MVP Architecture for DentalImperador on GitHub Pages

## Overview
This document describes a **minimal, production‑ready** setup that runs completely on **GitHub Pages** using only static assets (HTML, CSS, JavaScript). No server‑side code, no build tools required – just commit the files to the repository and enable GitHub Pages.

---

## Repository layout
```
DentalImperador/
├─ index.html          # entry point – loads the chatbot UI
├─ assets/
│   ├─ css/
│   │   └─ style.css   # global styling and design system
│   └─ js/
│       └─ app.js      # vanilla JS – chatbot logic & Groq integration
├─ README.md           # project description (optional)
└─ MVP.md              # **this** file – architecture guide
```
*All files are committed to the root of the repository (or you can place them inside a `docs/` folder and configure GitHub Pages to serve from there).* 

---

## 1️⃣ index.html (minimal starter)
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dental Imperador – Chatbot MVP</title>
    <link rel="stylesheet" href="assets/css/style.css" />
    <!-- Open Graph for better sharing -->
    <meta property="og:title" content="Dental Imperador – Chatbot MVP" />
    <meta property="og:description" content="Chatbot de atendimento para a Dental Imperador, hospedado no GitHub Pages." />
    <meta property="og:image" content="https://YOUR_USERNAME.github.io/DentalImperador/assets/img/og-image.png" />
</head>
<body>
    <header class="site-header">
        <h1>Dental Imperador</h1>
        <p>Chatbot de Atendimento – MVP</p>
    </header>

    <main class="chat-container">
        <section id="chat-window" class="chat-window"></section>
        <form id="chat-form" class="chat-form">
            <input type="text" id="user-input" placeholder="Digite sua mensagem..." autocomplete="off" required />
            <button type="submit">Enviar</button>
        </form>
    </main>

    <footer class="site-footer">
        <small>© 2026 Dental Imperador – Todos os direitos reservados.</small>
    </footer>

    <script src="assets/js/app.js"></script>
</body>
</html>
```
*Key points*
- No external libraries – pure HTML + CSS + vanilla JS.
- All assets are referenced with relative paths so they work on GitHub Pages without additional configuration.
- The `<meta>` tags ensure basic SEO and social‑preview.

---

## 2️⃣ assets/css/style.css (simple, responsive, premium look)
```css
/* Global reset */
* { margin:0; padding:0; box-sizing:border-box; }
html, body { height:100%; font-family: 'Inter', system-ui, sans-serif; background:#f5f7fa; color:#333; }

/* Header & Footer */
.site-header, .site-footer {
    background:#0066cc; color:#fff; text-align:center; padding:1rem;
}
.site-header h1 { margin-bottom:0.2rem; font-size:1.8rem; }

/* Chat container – centered, mobile‑first */
.chat-container {
    max-width:600px; margin:2rem auto; background:#fff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);
    display:flex; flex-direction:column; height:calc(100vh - 200px);
}
.chat-window {
    flex:1; overflow-y:auto; padding:1rem;
    display:flex; flex-direction:column; gap:0.75rem;
}
.chat-message { max-width:80%; padding:0.6rem 0.9rem; border-radius:12px; line-height:1.4; }
.bot { background:#e0e7ff; align-self:flex-start; }
.user { background:#0066cc; color:#fff; align-self:flex-end; }

.chat-form { display:flex; border-top:1px solid #ddd; }
.chat-form input {
    flex:1; border:none; padding:1rem; font-size:1rem;
    outline:none; border-radius:0 0 0 8px;
}
.chat-form button {
    background:#0066cc; color:#fff; border:none; padding:0 1.5rem; cursor:pointer; border-radius:0 0 8px 0;
}
.chat-form button:hover { background:#004f9e; }

/* Responsive tweaks */
@media (max-width:480px) {
    .chat-container { margin:0.5rem; height:calc(100vh - 120px); }
    .site-header h1 { font-size:1.5rem; }
}
```
*Design decisions*
- Uses **Inter** (Google Fonts) – you can add `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">` inside `<head>` if you want the exact font.
- A subtle **glass‑like** effect is achieved with light background colors and a soft box‑shadow.
- Mobile‑first layout, automatically centered on larger screens.

---

## 3️⃣ assets/js/app.js (vanilla chatbot logic + Groq call)
```js
// ---------- CONFIGURATION ----------
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"; // official Groq endpoint
const GROQ_MODEL = "mixtral-8x7b-32768"; // choose the model you prefer
// The API key **must** be stored in a GitHub secret and injected via the GitHub Pages build step.
// For a pure static site we use a thin proxy – see the optional "GitHub Action proxy" section below.

// ---------- DOM HELPERS ----------
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

function appendMessage(text, sender = "bot") {
    const msg = document.createElement("div");
    msg.className = `chat-message ${sender}`;
    msg.textContent = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight; // keep scroll at bottom
}

// ---------- BASIC CHAT FLOW ----------
chatForm.addEventListener("submit", async e => {
    e.preventDefault();
    const msg = userInput.value.trim();
    if (!msg) return;
    appendMessage(msg, "user");
    userInput.value = "";
    // Show typing indicator
    const typing = document.createElement("div");
    typing.className = "chat-message bot";
    typing.textContent = "…";
    chatWindow.appendChild(typing);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        const answer = await callGroq(msg);
        typing.remove();
        appendMessage(answer, "bot");
    } catch (err) {
        typing.remove();
        console.error(err);
        appendMessage("Desculpe, ocorreu um erro ao processar sua mensagem.", "bot");
    }
});

// ---------- GROQ CALL (via proxy) ----------
async function callGroq(userMessage) {
    // We cannot expose the API key on the client. The recommended approach is:
    // 1. Create a tiny GitHub Action that builds the site **and** writes the key to an environment variable.
    // 2. Deploy a small Netlify/Cloudflare function (or GitHub Pages *fetch* from a public proxy).
    // For the purpose of this MVP we will use a public proxy endpoint that you must create yourself.
    const proxyUrl = "https://YOUR_USERNAME.github.io/DentalImperador/proxy/groq-proxy.js"; // placeholder
    const response = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage })
    });
    if (!response.ok) throw new Error("Groq request failed");
    const data = await response.json();
    return data.answer; // expecting { answer: "..." }
}
```
### How the proxy works (optional, static‑site friendly)
1. **Create a tiny JavaScript file** `proxy/groq-proxy.js` inside the repo (it will be served as a static asset but executed on the client). The file contains a **fetch** request to the real Groq endpoint **with the API key stored in a GitHub secret** and injected at build time.
2. Add a **GitHub Action** (`.github/workflows/deploy.yml`) that:
   - Installs `node`.
   - Reads the secret `GROQ_API_KEY`.
   - Replaces a placeholder string in `proxy/groq-proxy.js` with the real key (using `sed`).
   - Builds the site (no build needed) and pushes to `gh-pages`.
3. The built site now contains a *static* proxy file that holds the key **only in the deployed artifact**, never in the source repository.

**Example proxy file (before injection):**
```js
// proxy/groq-proxy.js – will be **rewritten** by the CI step
const API_KEY = "{{GROQ_API_KEY}}"; // placeholder replaced by CI
export async function handler(event) {
    const { prompt } = await event.json();
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ model: "mixtral-8x7b-32768", messages: [{ role: "user", content: prompt }] })
    });
    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content ?? "Desculpe, não entendi.";
    return new Response(JSON.stringify({ answer }), { status: 200, headers: { "Content-Type": "application/json" } });
}
```
**GitHub Action snippet** (very small, placed in `.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Inject Groq API key
        run: |
          sed -i "s/{{GROQ_API_KEY}}/${{ secrets.GROQ_API_KEY }}/g" proxy/groq-proxy.js
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
```
*If you do **not** want to set up a proxy, replace `callGroq` with a simple **mock** response for local testing.

---

## 4️⃣ Enabling GitHub Pages
1. Push the repository to GitHub (`git push origin main`).
2. In the repo settings → **Pages** → **Source** select the branch `gh-pages` (automatically created by the Action) **or** the `main` branch / `/ (root)` if you prefer to serve directly from `main`.
3. After the workflow finishes, GitHub Pages will be available at:
   `https://YOUR_USERNAME.github.io/DentalImperador/`
4. Verify that `index.html` loads, the chat UI appears, and the bot answers (once the proxy is correctly set up).

---

## 5️⃣ Checklist for a production‑ready MVP
- [ ] Repository contains `index.html`, `assets/css/style.css`, `assets/js/app.js`.
- [ ] Add the optional `proxy/` folder and GitHub Action **if** you need a secure API key.
- [ ] Enable **GitHub Pages** in the repo settings.
- [ ] Verify the site works on **desktop**, **iOS**, and **Android** browsers.
- [ ] Test the chatbot with a few messages; make sure the Groq call returns within 2‑3 seconds.
- [ ] Update the **README.md** with a badge linking to the live GitHub Pages URL.
- [ ] (Optional) Add a `CNAME` file if you want a custom domain.

---

## 6️⃣ Next steps / Extensions
- **Persist conversation**: store each user message in Firestore using the Firebase client SDK (adds a few KB to the repo).
- **Authentication**: integrate Firebase Auth to identify returning clients.
- **Styling polish**: replace the simple CSS with a full **design system** (tokens, dark mode, glassmorphism).
- **Analytics**: include Google Analytics 4 or a lightweight alternative to monitor usage.
- **Testing**: add Cypress end‑to‑end tests that run on GitHub Actions to keep the MVP stable.

---

# TL;DR
1. Create the folder structure above.
2. Add the three files (`index.html`, `style.css`, `app.js`).
3. (Optional) Add the proxy + GitHub Action to keep the Groq API key secret.
4. Push to GitHub and enable **GitHub Pages**.
5. Visit `https://YOUR_USERNAME.github.io/DentalImperador/` – the chatbot MVP is live!

> **Happy coding!**
## 📈 Análise de Estoque Automática

Para melhorar a gestão de produtos, o sistema pode incluir um algoritmo que calcula o **giro de estoque** (quantidade vendida / quantidade em estoque) e identifica:

- **Produtos com baixo giro**: estoque está estagnado e pode gerar perdas.
- **Produtos próximos da validade**: necessidade de promoções ou descarte.
- **Produtos críticos**: alta demanda, mas risco de ruptura.

### Como funciona o algoritmo (pseudocódigo)

```pseudo
para cada produto em estoque:
    giro = vendas_30dias / quantidade_atual
    se giro < LIMIAR_BAIXO:
        marcar como "baixo giro"
    se dias_para_validade < LIMIAR_VALIDADE:
        marcar como "próximo da validade"
    se demanda_prevista > quantidade_atual:
        marcar como "atenção de ruptura"
```

### Integração ao front‑end

- Exibir uma **tabela** na página de administração com colunas: Produto, Giro, Dias até validade, Status.
- Permitir ao gestor **filtrar** por status e gerar **relatórios** para campanhas promocionais.

### Próximos passos

- Implementar a lógica no backend (ex.: Node.js ou Python) e expor via API REST.
- Consumir a API no `app.js` e atualizar a UI com os resultados.
- Definir valores de limiar (`LIMIAR_BAIXO`, `LIMIAR_VALIDADE`) em um arquivo de configuração.

