# Dental Imperador — Plataforma B2B de Atendimento Odontológico

Plataforma completa para distribuidores de produtos odontológicos, com chatbot inteligente (IA), orçamentos automáticos, CRM Kanban, gestão de pedidos, churn e muito mais.

> **Status:** ✅ 29 sprints concluídas — plataforma em produção
> **Frontend:** https://dentalimperador.web.app
> **Backend:** https://backend-production-4fc1.up.railway.app
> **Última atualização:** 2026-07-23

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + TypeScript + Vite (PWA) |
| Backend | NestJS + Prisma + SQLite |
| Chat/Firebase | Firebase Auth, Firestore, Hosting |
| AI | Groq API (LLaMA 3.3 70B) via endpoint `/api/v1/chat` |
| Email | SendGrid (campanhas de retenção) |
| Deploy | Firebase Hosting (frontend) + Railway (backend) |

---

## Telas (App React + PWA)

| Rota | Funcionalidade |
|---|---|
| `/` | Landing Page adaptativa por papel |
| `/chatbot` | Chatbot com triagem + IA + criação de lead (público) |
| `/orcamento` | Catálogo com preço normal + promocional |
| `/pedido` | Consulta de status com timeline |
| `/dashboard` | Métricas e gráficos (Chart.js) |
| `/crm` | Kanban drag-and-drop + Perfil 360° + clusters |
| `/metricas-vendas` | Funil de vendas, ranking vendedores |
| `/churn` | Dashboard de churn com score de risco |
| `/campanhas` | Gestão de campanhas de retenção |
| `/picking` | Monitor de separação de pedidos |
| `/relatorios` | Exportação CSV |
| `/admin` | KPIs consolidados, SLA, gestão de usuários |
| `/meu-painel` | Painel do cliente logado com gráficos |
| `/perfil` | Dados cadastrais e preferências |
| `/login` | Autenticação Firebase |

---

## Roadmap

| Sprint | Foco | Status |
|---|---|---|
| 0-12 | Fase 1 — MVP Base | ✅ |
| 13-20 | Fase 2 — CRM Avançado | ✅ |
| 21 | Data Real: Mocks → Prisma/SQLite | ✅ |
| 22 | Schemas Faltantes + 7 novos modelos | ✅ |
| 23 | Integrações (Groq, SendGrid, Firebase Admin, CI/CD) | ✅ |
| 24 | Logger, Toast, Testes, PWA | ✅ |
| 25 | UX Final: Perfil, MeuPainel, Admin real | ✅ |
| 26 | Chatbot Público (sem login) | ✅ |
| 27 | Precificação (promocional + lista acadêmica) | ✅ |
| 28-29 | Eliminar Cloud Functions → NestJS + Railway | ✅ |
| 30 | Correções Pós-Deploy (db, PWA, meta tags) | 🔄 |

> Roadmap detalhado em `docs/implementation.md`

---

## Ambiente de Desenvolvimento

```bash
# Terminal 1 — Backend
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev        # http://localhost:3001

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev              # http://localhost:5173
```

---

## Deploy em Produção

```bash
# Frontend (Firebase Hosting)
cd frontend && npm run build --mode production && cd .. && firebase deploy --only hosting

# Backend (Railway — deploy automático via GitHub)
git add . && git commit -m "..." && git push
```

> Consulte `docs/deployment.md` para instruções detalhadas.

---

## Documentação

| Arquivo | Conteúdo |
|---|---|
| `docs/context.md` | Visão geral do produto e jornada do usuário |
| `docs/implementation.md` | Roadmap completo de todas as 29 sprints |
| `docs/stack.md` | Stack tecnológica detalhada |
| `docs/deployment.md` | Guia de deploy, CI/CD e Railway |
| `docs/integracao_erp_dados.md` | Integração com ERP FlexTotal |
| `docs/lucas/` | Endpoints da API do ERP |

---

## Créditos

Desenvolvido pela **Cerrado Tech** para a Dental Imperador.
