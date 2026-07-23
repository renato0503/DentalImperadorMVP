# Stack Tecnológica — Dental Imperador (v6.0.0)

## Projeto Firebase

| Propriedade | Valor |
|---|---|
| Project ID | `dentalimperador-d2529` |
| Domínio de produção | `dentalimperador.web.app` |
| Auth Domain | `dentalimperador-d2529.firebaseapp.com` |
| Storage Bucket | `dentalimperador-d2529.firebasestorage.app` |

## Serviços Firebase Ativos

| Serviço | Status | Uso |
|---|---|---|
| **Authentication** | Produção | Login via email/senha (admin, manager, operator, cliente) |
| **Firestore** | Produção | Conversas do chat, sessões |
| **Hosting** | Produção | Deploy do frontend PWA |
| **Storage** | Produção | Assets e anexos |

## Arquitetura Geral

```
┌─────────────────────────────────────────────┐
│              Frontend (PWA)                   │
│     React 18 + TypeScript + Vite              │
│         Firebase Hosting                      │
└──────────┬────────────────────┬──────────────┘
           │                    │
           ▼                    ▼
┌──────────────────┐  ┌────────────────────────┐
│  Firebase Auth    │  │  Backend (NestJS)       │
│  (Identity)       │  │  Railway (Cloud)        │
└──────────────────┘  └──────────┬─────────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
           ┌────────────┐ ┌────────────┐ ┌────────┐
           │   SQLite   │ │    Groq    │ │Firestore│
           │  (dev/prod)│ │  API (AI)  │ │ (Chat)  │
           └────────────┘ └────────────┘ └────────┘
                    │
                    ▼
           ┌────────────────────────┐
           │  ERP FlexTotal (D14)   │
           │  Produtos + Estoque    │
           └────────────────────────┘
```

## Stack Detalhada

### Frontend
| Item | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite 8 (PWA template) |
| Service Worker | Workbox (vite-plugin-pwa) |
| UI | Design System próprio (CSS vars, Inter + Montserrat) |
| Gráficos | Chart.js + react-chartjs-2 |
| Kanban | @hello-pangea/dnd |
| Ícones | Lucide React |
| Notificações | Toast customizado |
| Deploy | Firebase Hosting → `dentalimperador.web.app` |

### Backend (NestJS)
| Item | Tecnologia |
|---|---|
| Runtime | Node.js 20 + TypeScript |
| ORM | Prisma 5.22 |
| Banco | SQLite (dev/prod — Railway) |
| Cache | In-memory Map (Redis via REDIS_URL) |
| Autenticação | Firebase Admin SDK (ADC) |
| Chat IA | Groq API (LLaMA 3.3 70B) — endpoint `/api/v1/chat` |
| Validação | class-validator + class-transformer |
| Rate limiting | @nestjs/throttler |
| API Key Guard | Header `x-api-key` para rotas B2B |
| Deploy | Railway (`backend-production-4fc1.up.railway.app`) |

### Infraestrutura e Deploy
| Item | Tecnologia |
|---|---|
| Frontend | Firebase Hosting |
| Backend | Railway (Railpack, Node 22) |
| CI/CD | GitHub Actions (Firebase token no GitHub Secrets) |
| Email | SendGrid (campanhas de retenção) |
| Monitoramento | Railway Dashboard + Firebase Console |

## Rotas da API

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/v1/health` | Health check | Público |
| GET | `/api/v1/products` | Catálogo de produtos | API Key |
| GET | `/api/v1/orders` | Listar pedidos | API Key |
| GET/POST/PATCH/DELETE | `/api/v1/customers` | CRUD clientes | API Key |
| GET | `/api/v1/churn/risks` | Risco de churn | API Key |
| GET/POST | `/api/v1/churn/campaigns` | Campanhas | API Key |
| GET/POST | `/api/v1/warehouse/picks` | Picking | API Key |
| GET | `/api/v1/reports/*` | Relatórios | API Key |
| GET | `/api/v1/admin/*` | Admin | API Key |
| GET/PATCH | `/api/v1/notifications` | Notificações | Público |
| GET/POST | `/api/v1/crm/*` | CRM | API Key / Público |
| POST | `/api/v1/chat` | Chat IA (Groq) | Público |
| POST | `/api/v1/crm/auto-create-lead` | Criar lead | Público |
| GET | `/api/docs` | Swagger UI | API Key |

## Variáveis de Ambiente

| Variável | Local | Descrição |
|---|---|---|
| `PORT` | backend/.env | Porta do servidor (3001 dev, 8080 Railway) |
| `DATABASE_URL` | backend/.env | Conexão SQLite: `file:./dev.db` |
| `GROQ_API_KEY` | backend/.env + Railway | Chave da API Groq |
| `SENDGRID_API_KEY` | backend/.env | Chave de email SendGrid |
| `REDIS_URL` | backend/.env | Redis cache |
| `FLEXTOTAL_*` | backend/.env | Credenciais ERP |
| `GOOGLE_APPLICATION_CREDENTIALS` | backend/.env | Firebase Admin |
| `NODE_ENV` | Railway | `production` |
| `FIREBASE_TOKEN` | GitHub Secrets | Deploy do Firebase |
| `VITE_API_URL` | frontend/.env.production | URL do backend em produção |

## Convenções

| Item | Padrão |
|---|---|
| Commits | Conventional Commits |
| Branch | `main` (protegida) |
| Versionamento | SemVer |
