# Dental Imperador — MVP Funcional (Estático)

Protótipo de múltiplas telas, HTML/CSS/JS puro, **sem backend**, com dados simulados.
Pronto para publicação no GitHub Pages (a pasta `mvp/` é publicada pela branch `gh-pages`).

## Telas

| Arquivo           | Tela                  | Conteúdo                                              |
| ----------------- | --------------------- | ----------------------------------------------------- |
| `index.html`      | Landing Page          | Apresentação da Dental Imperador                       |
| `chatbot.html`    | Chatbot              | Triagem, orçamento e status (fluxo mockado)          |
| `orcamento.html`  | Orçamento Automático  | Catálogo + geração de proposta                       |
| `pedido.html`     | Status de Pedido     | Consulta e linha do tempo de entrega                  |
| `dashboard.html`  | Dashboard            | Métricas e gráficos (Chart.js, mock)                 |
| `crm.html`        | CRM / Kanban         | Pipeline de leads com drag-and-drop                   |

## Estrutura

```
mvp/
├── index.html          # Landing (entrada)
├── chatbot.html
├── orcamento.html
├── pedido.html
├── dashboard.html
├── crm.html
└── assets/
    ├── img/logodental.png
    ├── css/style.css    # Design system (Media Kit)
    └── js/
        ├── layout.js     # Shell compartilhado (sidebar + topbar)
        ├── chat.js
        ├── orcamento.js
        ├── pedido.js
        ├── dashboard.js
        └── crm.js
```

## Design

Segue o Media Kit: Verde Imperador `#00A650`, Vermelho Dental `#E31E24`, fontes
Montserrat (títulos) + Inter (corpo).

## Observações

- `lucide` (ícones) e `Chart.js` são carregados via CDN — é necessário acesso à internet.
- Todos os dados são fictícios e apenas demonstrativos.

## Publicar

O workflow `.github/workflows/deploy.yml` publica esta pasta em `gh-pages` ao fazer push em `main`.
Site: `https://<usuario>.github.io/<repo>/`
