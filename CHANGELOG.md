# Changelog — Dental Imperador

Todas as alterações notáveis do projeto serão documentadas neste arquivo.

## [7.0.0] — 2026-07-23

### Adicionado (Sprints 26-29)

#### Sprint 26 — Chatbot Público (sem login)
- ChatWidget: aceita `leadData` como prop, usa UUID anônimo, não depende de login Firebase
- Cloud Function `callGroq`: removida validação `request.auth` (pública)
- `@Public()` no endpoint `POST /api/v1/crm/auto-create-lead`
- Firestore rules: conversas públicas (leitura/escrita liberada)
- Índice composto do Firestore para conversas criado

#### Sprint 27 — Nova Precificação
- `preco_promocional Float?` adicionado ao modelo Product no Prisma
- Orçamento: mostra preço normal riscado + promocional em verde
- Checkbox "Lista Acadêmica" desliga preço promocional (força tabela cheia)
- TriagemForm: pergunta "Você é estudante de Odontologia?"
- Prompt Groq: regras de lista acadêmica (tabela cheia) e 5-7% de desconto para regulares
- CRM registra `lista_academica: SIM/NÃO` na `nota_interna` do lead

#### Sprint 28-29 — Eliminação de Cloud Functions + Deploy Railway
- Cloud Function `callGroq` deletada do Firebase
- Novo `ChatModule` no backend NestJS: `POST /api/v1/chat` chama Groq API diretamente
- ChatWidget atualizado para chamar `/api/v1/chat` via fetch
- `GROQ_API_KEY` movida do Secret Manager para `backend/.env`
- Zero custo de Cloud Functions, Cloud Run e Secret Manager
- Frontend: `VITE_API_URL` para apontar para Railway em produção
- `API_BASE` helper em `frontend/src/lib/api.ts`
- Mensagens do chat com layout WhatsApp (bolha verde/bege, autor, formatação)
- Indicador de digitação (3 pontinhos animados)
- Notificações: toast de erro removido (falha silenciosa)
- Erro de lead: tratado silenciosamente (chat funciona mesmo sem lead)

## [6.0.0] — 2026-07-23

### Adicionado (Sprints 23-25)

#### Sprint 23 — Integrações Externas
- **Groq API**: chave configurada no Secret Manager, Cloud Function redeployada com IA funcional
- **Firebase Admin**: autenticação via ADC (`gcloud auth application-default-login`)
- **CI/CD**: token `FIREBASE_TOKEN` gerado e salvo no GitHub Secrets
- **SendGrid**: chave configurada para email de campanhas de retenção
- **ERP FlexTotal**: endpoints D14/D15/D16 validados (catálogo, estoque, ficha técnica)
- CSP atualizado com `*.cloudfunctions.net` e `*.up.railway.app`

#### Sprint 24 — Infraestrutura & Qualidade
- Logger do NestJS no lugar de `console.log` (main.ts, prisma.service.ts)
- ToastContainer no frontend (auto-dismiss 4s)
- Testes unitários: ProductsService (Jest, 3 testes)
- PWA: Service Worker com 24 entries precached

#### Sprint 25 — UX Final & QA
- **Perfil**: edição inline de nome/telefone, botão "Alterar Senha"
- **MeuPainel**: gráfico de gastos (Chart.js), métricas reais
- QA: builds limpos (backend 0 erros, frontend PWA)

## [5.0.0] — 2026-07-23

### Adicionado (Sprints 21-22)

#### Sprint 21 — Data Real: Mocks → SQLite
- Schema adaptado para SQLite (dev) com suporte a PostgreSQL (prod)
- Modelo `User` expandido: cpf_cnpj, telefone, segmento, limite_credito, etc.
- Modelo `Order` expandido: endereco_entrega
- DTOs com class-validator: CreateCustomerDto, UpdateCustomerDto
- ValidationPipe global
- ProductsService, CustomersService, OrdersService usando Prisma

#### Sprint 22 — Schemas Faltantes + Migrations
- 7 novos modelos Prisma: Notification, PickRequest, PickEvent, Campaign, TimelineEvent, SalesAlert, Estimate, ActivityLog
- User expandido com campos CRM: ticket_cluster, vendedor_uid, propensao_compra, etc.
- Todos os 12 services migrados para Prisma
- Seed com dados de teste (clientes, produtos, pedidos, notificações, campanhas)

## [4.0.0] — 2026-07-22

### Adicionado (Sprints 19-20)
- GROQ_API_KEY configurada no Firebase Secret Manager
- Cloud Function callGroq buildada e deployada
- `POST /crm/auto-create-lead` com round-robin
- `POST /crm/whatsapp/incoming` webhook mock
- Prompt Groq aprimorado com qualificação de leads
- Aba WhatsApp no perfil 360°

## [3.0.0] — 2026-07-22

### Adicionado (Sprints 13-18)
- CRM enriquecido: clusterização por ticket/frequência/segmento
- Perfil 360° com timeline, pedidos, orçamentos e notas
- Sidebar por papel com redirect pós-login
- Sistema de notificações com 6 regras de salvaguarda
- Landing adaptativa e onboarding tour
- Métricas de vendas: funil, ranking, projeção

## [2.0.0] — 2026-07-22

### Adicionado (Sprints 9-12)
- Super Admin: KPIs, gráficos, SLA, gestão de usuários
- API B2B: Swagger UI, ApiKey guard, OpenAPI 3.0
- Mobile-first: telas <375px, safe-area, PWA manifest
- RBAC com 4 papéis

## [1.0.0] — 2026-07-21

### Adicionado (Sprints 5-8)
- Módulo de Churn: riscos, campanhas, dashboard
- Warehouse Picking: REST API, EventEmitter, monitor
- Relatórios: CSV, filtros, períodos
- Performance: code-splitting, Redis cache, health check

## [0.1.0] — 2026-07-14

### Adicionado (Sprints 0-4)
- Definição de stack: React + NestJS + Firebase
- Monorepo com workspaces npm
- Frontend React + Vite + PWA
- Backend NestJS + Prisma
- Firebase Auth, Firestore, Hosting
- Chatbot com triagem e IA
- Orçamento e status de pedido
- CRM Kanban com drag-and-drop
- Dashboard com Chart.js
- Modo dark/light
