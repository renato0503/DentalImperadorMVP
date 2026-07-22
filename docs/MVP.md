# MVP — Status e pendências

Este arquivo registra o estado do MVP: o que foi feito, o que falta e o histórico de problemas de deploy (já resolvidos).

> Atualizado em: 2026-07-14

## Estado atual (resumo)
- **MVP funcional estático ENTREGUE** e **publicado com sucesso** no GitHub Pages: https://renato0503.github.io/DentalImperadorMVP/
- Site multi-páginas em HTML/CSS/JS puro, na **raiz** do repositório, com dados mockados.
- Deploy automatizado via GitHub Actions (push em `main` → `gh-pages` → build do Pages).

## O que foi feito
- Site estático com 6 telas: `index.html` (Landing), `chatbot.html`, `orcamento.html`, `pedido.html`, `dashboard.html`, `crm.html`.
- Design system seguindo o Media Kit (Verde Imperador `#00A650`, Vermelho Dental `#E31E24`, Montserrat + Inter) em `assets/css/style.css`.
- Logo `logodental.png` em `assets/img/` (usada no header e no footer).
- Dados reais da Dental Imperador aplicados no site (contato, endereço, Missão/Visão/Valores e as 51 categorias de produto) e crédito "Cerrado Tech" no footer.
- Header responsivo (desktop + menu mobile iOS/Android) e footer com categorias em colunas.
- `.gitignore` ajustado para ignorar só docs de projeto e imagens-fonte da raiz; o site é sempre versionado.
- Correção de bug: a logo não aparecia (404) porque o `.gitignore` ignorava `logodental.png` em qualquer pasta; corrigido ancorando o padrão à raiz (`/logodental.png`).

## Estrutura final (raiz do repo)
```
index.html  chatbot.html  orcamento.html  pedido.html  dashboard.html  crm.html
assets/img/logodental.png
assets/css/style.css
assets/js/{layout,chat,orcamento,pedido,dashboard,crm}.js
.github/workflows/deploy.yml
```

## O que falta / próximos passos
- **Login (Firebase Auth):** previsto nos Sprints, ainda não implementado no protótipo estático.
- **Backend real:** dados hoje são mockados; migrar para Firebase/Firestore + Groq conforme `implementation.md`.
- **Integrações:** almoxarifado, ERP, gateway de pagamento, módulo de churn, Super Admin (Sprints 5-12).
- **PWA real:** Service Worker/offline e install prompt.

## Deploy
- Workflow: `.github/workflows/deploy.yml` (peaceiris/actions-gh-pages, `publish_dir: ./` → branch `gh-pages`).
- Após o push em `main`, o GitHub faz o build (`pages-build-deployment`) e publica.
- Commits relevantes: scaffold inicial · "Add MVP multi-page site" · "Move site MVP para a raiz" · "Fix: versiona assets/img/logodental.png".

## Histórico de problemas de deploy (RESOLVIDOS)
- Várias runs falharam por dependências de ações obsoletas (ex.: `actions/upload-artifact@v3` e transitive deps). Migrou-se para deploy por git direto (peaceiris).
- Erro crítico no runner: a workflow fazia `git checkout gh-pages` + `git rm -rf .` antes de copiar `mvp/`, e a cópia falhava porque `mvp/` não estava no working tree naquele momento. Mitigação: publicar a raiz diretamente (`publish_dir: ./`), eliminando a etapa de cópia/branch switch.
- Logo 404 no Pages: `.gitignore` ignorava `logodental.png` em qualquer pasta (incluindo `assets/img/`). Corrigido com padrão ancorado `/logodental.png` (ignora só a raiz).
- Observação histórica: em iterações anteriores os arquivos `context.md`, `implementation.md`, etc. não estavam presentes no working tree; hoje existem na raiz e estão atualizados.
