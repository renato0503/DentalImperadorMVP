# Dental Imperador — Plataforma B2B de Atendimento Odontológico

Plataforma completa para distribuidores de produtos odontológicos, com chatbot inteligente, orçamentos automáticos, CRM e gestão de pedidos.

> **Status:** MVP em desenvolvimento (3 de 13 sprints concluídas)
> **Última atualização:** 2026-07-21

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + TypeScript + Vite (PWA) |
| Backend | NestJS + Prisma + PostgreSQL |
| Chat/Firebase | Firebase Auth, Firestore, Hosting, Cloud Functions |
| AI | Groq API (llama-3.3-70b-versatile) |
| Eventos | Google Cloud Pub/Sub |
| Cache | Redis |
| Deploy | Firebase Hosting + GitHub Pages |

---

## Telas (App React + PWA)

| Rota | Funcionalidade |
|---|---|
| `/` | Landing Page |
| `/chatbot` | Chatbot com triagem automática + IA |
| `/orcamento` | Catálogo de produtos + geração de proposta |
| `/pedido` | Consulta de status com timeline |
| `/dashboard` | Métricas e gráficos (Chart.js) |
| `/crm` | Kanban drag-and-drop de leads |
| `/login` | Autenticação Firebase |

---

## Protótipo Estático

Uma versão anterior do protótipo (HTML/CSS/JS puro) está disponível em:
- **GitHub Pages:** https://renato0503.github.io/DentalImperadorMVP/
- **Código:** `index.html`, `chatbot.html`, `orcamento.html`, `pedido.html`, `dashboard.html`, `crm.html` (na raiz do repo)

---

## Deploy em Produção

**URL:** https://dentalimperador.web.app

```bash
# Frontend
cd frontend && npm run build && cd .. && firebase deploy --only hosting

# Backend
cd backend && npm run build && npm run start:prod

# Cloud Functions
firebase deploy --only functions
```

> Consulte `docs/deployment.md` para instruções detalhadas de CI/CD, rollback e monitoramento.

---

## Roadmap

| Sprint | Status |
|---|---|
| 0 — Preparação | ✅ |
| 1 — Fundamentos MVP | ✅ |
| 2 — Chatbot Avançado | ✅ |
| 3 — CRM Core | ✅ |
| 4 — Polimento MVP | 🔄 |
| 5 — Churn | ⏳ |
| 6 — Picking | ⏳ |
| 7 — Relatórios | ⏳ |
| 8 — Performance/Segurança | ⏳ |
| 9 — Super Admin | ⏳ |
| 10 — API B2B | ⏳ |
| 11 — Mobile | ⏳ |
| 12 — Release | ⏳ |

> Roadmap completo em `docs/implementation.md`

---

## Documentação

| Arquivo | Conteúdo |
|---|---|
| `docs/context.md` | Visão geral do produto e jornada do usuário |
| `docs/implementation.md` | Roadmap com status de cada sprint |
| `docs/stack.md` | Stack tecnológica detalhada |
| `docs/deployment.md` | Guia de deploy, CI/CD e rollback |
| `docs/integracao_erp_dados.md` | Integração com ERP FlexTotal |
| `docs/lucas/` | Endpoints da API do ERP |

---

## Ambiente de Desenvolvimento

```bash
# 1. Iniciar banco + cache
docker compose up -d

# 2. Backend
cd backend
cp .env.example .env     # Configurar DATABASE_URL
npm install
npx prisma migrate dev
npm run start:dev        # http://localhost:3001

# 3. Frontend
cd frontend
npm install
npm run dev              # http://localhost:5173
```

---

## Créditos

MVP criado pela **Cerrado Tech** para a Dental Imperador.
