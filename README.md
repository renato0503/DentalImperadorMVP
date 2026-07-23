# Dental Imperador — Plataforma B2B de Atendimento Odontológico

Plataforma completa para distribuidores de produtos odontológicos, com chatbot inteligente, orçamentos automáticos, CRM e gestão de pedidos.

> **Status:** ✅ Plataforma completa — todas as 25 sprints concluídas
> **Última atualização:** 2026-07-23

---

## Stack

| Camada | Tecnologia |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite (PWA) |
| Backend | NestJS + Prisma + SQLite (dev) / PostgreSQL (prod) |
| Chat/Firebase | Firebase Auth, Firestore, Hosting, Cloud Functions |
| AI | Groq API (llama-3.3-70b-versatile) |
| Email | SendGrid |
| Deploy | Firebase Hosting + GitHub Actions |

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

## Telas (App React + PWA)

| Rota | Funcionalidade |
|---|---|
| `/` | Landing Page adaptativa por papel |
| `/chatbot` | Chatbot com triagem automática + IA + criação de lead |
| `/orcamento` | Catálogo de produtos + geração de proposta |
| `/pedido` | Consulta de status com timeline |
| `/dashboard` | Métricas e gráficos (Chart.js) |
| `/crm` | Kanban drag-and-drop + Perfil 360° + aba WhatsApp |
| `/metricas-vendas` | Funil de vendas, ranking vendedores, projeção |
| `/churn` | Dashboard de churn com score de risco |
| `/campanhas` | Gestão de campanhas de retenção |
| `/picking` | Monitor de separação de pedidos |
| `/relatorios` | Exportação de dados (CSV/PDF) |
| `/admin` | Painel consolidado com KPIs e SLA |
| `/meu-painel` | Painel do cliente logado |
| `/perfil` | Dados cadastrais e preferências |
| `/login` | Autenticação Firebase |

---

## Roadmap

| Sprint | Foco | Status |
|---|---|---|
| 0-12 | Fase 1 — MVP Base (Chatbot, CRM, Churn, Picking, Admin, API B2B) | ✅ |
| 13-20 | Fase 2 — Workflow Orientation (Perfil 360°, Notificações, Métricas, Leads) | ✅ |
| 21 | Data Real: Mocks → Prisma/SQLite | ✅ |
| 22 | Schemas Faltantes + Migrations (7 novos modelos) | ✅ |
| 23 | Integrações Externas (Groq, SendGrid, Firebase Admin, CI/CD) | ✅ |
| 24 | Infraestrutura & Qualidade (Logger, Toast, Testes, PWA) | ✅ |
| 25 | UX Final & QA (Perfil, MeuPainel, Admin real) | ✅ |

> Roadmap detalhado em `docs/implementation.md`

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
# 1. Backend (sem Docker — SQLite nativo)
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev        # http://localhost:3001

# 2. Frontend
cd frontend
npm install
npm run dev              # http://localhost:5173

# Para PostgreSQL + Redis (produção):
# docker compose up -d
# DATABASE_URL=postgresql://dental:dental123@localhost:5432/dentalimperador?schema=public
```

---

## Créditos

MVP criado pela **Cerrado Tech** para a Dental Imperador.
