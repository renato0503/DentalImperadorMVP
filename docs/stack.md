# Stack Tecnológica — Dental Imperador

## Projeto Firebase

| Propriedade | Valor |
|---|---|
| Project ID | `dentalimperador-d2529` |
| Auth Domain | `dentalimperador-d2529.firebaseapp.com` |
| Storage Bucket | `dentalimperador-d2529.firebasestorage.app` |
| App ID | `1:330816807481:web:f3b98cbe9a24aaac9763e8` |
| Domínio de produção | `dentalimperador.web.app` |

## Serviços Firebase Ativos

| Serviço | Status | Uso |
|---|---|---|
| **Authentication** | Produção | Login de usuários internos (admin/manager/operator) |
| **Data Connect (PostgreSQL)** | Produção | Banco relacional: customers, orders, products, inventory |
| **Firestore** | Produção | Apenas conversas de chat, sessões e notificações push |
| **Storage** | Produção | Assets, imagens de produtos, anexos |
| **Hosting** | Produção | Deploy do frontend (PWA) |
| **Analytics** | Produção | Métricas de uso do site |

## Arquitetura Geral

```
┌──────────────────────────────────────────────────────┐
│                  Frontend (PWA)                        │
│         React 18 + TypeScript + Vite                   │
│              Firebase Hosting                          │
└──────────┬──────────────────────────┬──────────────────┘
           │                          │
           ▼                          ▼
┌──────────────────┐    ┌──────────────────────────┐
│   Firebase Auth   │    │   Backend Core (NestJS)   │
│   (Identity)      │    │   Cloud Run / Compute      │
└──────────────────┘    └──────────┬──────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
           ┌────────────┐ ┌────────────┐ ┌────────────┐
           │ PostgreSQL  │ │   Redis    │ │  Firestore  │
           │ (Data Conn.)│ │  (Cache)   │ │  (Chat)     │
           └────────────┘ └────────────┘ └────────────┘
                    │              │
                    ▼              ▼
           ┌──────────────────────────────────┐
           │      Google Cloud Pub/Sub          │
           │  (eventos: picking, pedidos, etc) │
           └──────────────────────────────────┘
                    │
                    ▼
           ┌──────────────────────────────────┐
           │  ERP FlexTotal (adaptador)        │
           │  D14/D15/D16 + endpoints futuros  │
           └──────────────────────────────────┘

                    ┌──────────────────────────┐
                    │  Cloud Functions 2nd Gen  │
                    │  callGroq (AI)            │
                    └──────────────────────────┘
```

## Stack Detalhada

### Frontend
- **Framework:** React 18 + TypeScript
- **Bundler:** Vite (PWA template)
- **Service Worker:** Workbox (offline + cache)
- **UI:** Design System próprio (tokens CSS, Inter + Montserrat)
- **Gráficos:** Chart.js
- **Kanban:** @hello-pangea/dnd
- **Tabelas:** React Table
- **Ícones:** Lucide
- **Testes:** Jest (unit) + Cypress (e2e) + axe (a11y)
- **Deploy:** Firebase Hosting → `dentalimperador.web.app`

### Backend Core (NestJS)
- **Runtime:** Node.js + TypeScript
- **ORM:** Prisma ou TypeORM
- **Banco:** PostgreSQL via Firebase Data Connect
- **Cache:** Redis (Memorystore ou self-hosted)
- **Rate limiting:** @nestjs/throttler
- **Autenticação:** Firebase Admin SDK (verifica tokens JWT)
- **Eventos:** @nestjs/microservices + Google Cloud Pub/Sub
- **Adapter ERP:** FlexTotalAdapter (REST para D14/D15/D16)
- **Testes:** Jest (unit) + Pact (contrato)

### Firebase / Cloud Functions (2nd Gen)
- **AI:** `callGroq` — chamada para Groq API (orçamentos, sugestões)
- **Chat:** Coleção `conversations` no Firestore (onSnapshot)
- **Notificações:** Firebase Cloud Messaging (push)
- **Segurança:** `firestore.rules` restritivas por role

### Infraestrutura
- **CI/CD:** GitHub Actions (lint → test → build → deploy)
- **Staging:** Firebase Hosting (branch preview)
- **Produção:** Firebase Hosting custom domain
- **Monitoramento:** Google Cloud Monitoring + Alerting
- **Billing Alerts:** Configurados no GCP

## Convenções

| Item | Padrão |
|---|---|
| Commits | Conventional Commits (`feat:`, `fix:`, `chore:`, etc.) |
| Linter | ESLint + Prettier |
| Branch | `main` (protegida), `develop`, `feature/*`, `fix/*` |
| Versionamento | SemVer (`v1.0.0`, `v2.0.0`) |

## Variáveis de Ambiente

Todas as secrets estão no `.env` (não versionado). Use `.env.example` como template.

| Variável | Onde usar |
|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | Frontend (Vite) |
| `GROQ_API_KEY` | Cloud Function callGroq |
| `FLEXTOTAL_*` | NestJS (FlexTotalAdapter) |
| `DATABASE_URL` | NestJS (Prisma/TypeORM → PostgreSQL) |
| `REDIS_URL` | NestJS (cache) |
| `SENDGRID_API_KEY` | NestJS (churn emails) |
| `TWILIO_*` | NestJS (churn SMS) |
