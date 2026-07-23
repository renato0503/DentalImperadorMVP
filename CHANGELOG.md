# Changelog — Dental Imperador

Todas as alterações notáveis do projeto serão documentadas neste arquivo.

## [6.0.0] — 2026-07-23

### Adicionado (Sprints 26-29)

#### Sprint 26 — Chatbot Público
- ChatWidget: aceita `leadData` como prop, usa UUID anônimo, não depende de login
- `callGroq` Cloud Function: removida validação de auth (público)
- `@Public()` no endpoint `autoCreateLead`
- Firestore rules: conversas públicas
- Índice composto do Firestore criado

#### Sprint 27 — Nova Precificação
- `preco_promocional Float?` no schema Product
- Orçamento: mostra preço normal riscado + promocional em verde
- Checkbox "Lista Acadêmica" desliga preço promocional
- TriagemForm: pergunta "Você é estudante?"
- Prompt Groq: regras de lista acadêmica (tabela cheia) e 5-7% desconto para regulares

#### Sprint 28-29 — Eliminação de Custos com Cloud Functions
- Cloud Function deletada (não há mais funções no Firebase)
- Novo `ChatModule` no backend NestJS: `POST /api/v1/chat`
- ChatWidget chama `/api/chat` em vez de Cloud Function
- GROQ_API_KEY movida para `backend/.env`
- Zero custo de Cloud Functions, Cloud Run, Secret Manager

#### Sprint 23 — Integrações Externas
- **Groq API**: chave `GROQ_API_KEY` configurada no Firebase Secret Manager, Cloud Function `callGroq` redeployada com IA funcional (LLaMA 3.3 70B)
- **Firebase Admin**: autenticação via Application Default Credentials (`gcloud auth application-default-login`)
- **CI/CD**: token `FIREBASE_TOKEN` gerado via `firebase login:ci` e salvo no GitHub Secrets
- **SendGrid**: chave de API configurada para disparo de emails de campanhas de retenção
- **ERP FlexTotal**: endpoints D14/D15/D16 validados (catálogo, estoque, ficha técnica). Aguardando Lucas liberar endpoints de clientes/pedidos
- Twilio SMS não utilizado (números BR sem suporte a SMS)

#### Sprint 24 — Infraestrutura & Qualidade
- Logger do NestJS no lugar de `console.log` em `main.ts` e `prisma.service.ts`
- Toast notifications no frontend substituindo `console.error` (3 arquivos: Chatbot, CRM, useNotifications)
- `ToastContainer` com auto-dismiss em 4s
- Testes unitários: `ProductsService` (3 testes, Jest configurado)
- PWA: Service Worker gerado pelo Workbox (vite-plugin-pwa), 24 entries precached

#### Sprint 25 — UX Final & QA
- **Perfil**: edição inline de nome e telefone, botão "Alterar Senha", seção de preferências
- **MeuPainel**: gráfico de gastos por pedido (Chart.js), métricas reais, tabela de pedidos, ações rápidas
- **AdminDashboard**: toast de erro no lugar de `console.error`
- **CRM**: toasts de feedback para criação de cliente e atribuição de vendedor
- **Notificações**: toast de erro no hook `useNotifications`
- **Chatbot**: toast de erro ao falhar criação de lead
- QA final: 19 endpoints backend OK, frontend build limpo com PWA

## [4.0.0] — 2026-07-23

### Adicionado (Sprints 21-22)

#### Sprint 21 — Data Real: Mocks → PostgreSQL
- Schema Prisma adaptado para SQLite (dev) com suporte a PostgreSQL (prod)
- Modelo `User` expandido: `cpf_cnpj`, `telefone`, `segmento`, `limite_credito`, `total_gasto`, `ultima_compra`, `origem`
- Modelo `Order` expandido: `endereco_entrega`
- DTOs com `class-validator`: `CreateCustomerDto`, `UpdateCustomerDto`, `ProductQueryDto`, `OrderQueryDto`
- `ValidationPipe` global com `whitelist: true` no NestJS
- **ProductsService**: consultas Prisma no lugar de `MOCK_PRODUCTS`, cache mantido
- **CustomersService**: CRUD real via Prisma (create/findMany/update/delete)
- **OrdersService**: consultas com `include` (cliente, items → product), mapeamento para interface esperada
- Seed populando 8 customers, 4 produtos, 3 pedidos com itens via FK
- API Key guard mantido (header `x-api-key: demo-key-2026`)
- `*.db` adicionado ao `.gitignore`

#### Sprint 22 — Schemas Faltantes + Migrations
- 7 novos modelos Prisma: `Notification`, `PickRequest`, `PickEvent`, `Campaign`, `TimelineEvent`, `SalesAlert`, `Estimate`, `ActivityLog`
- `User` expandido com campos CRM: `ticket_cluster`, `frequencia_cluster`, `vendedor_uid`, `propensao_compra`, `ultimo_contato`, `proximo_contato`, `nota_interna`, `churn_risk`, `endereco` (JSON)
- **NotificationsService**: consultas Prisma (findAll, unreadCount, markAsRead, markAllAsRead)
- **WarehouseService**: picks e eventos via Prisma, EventEmitter mantido
- **ChurnService**: customers via `prisma.user` (sem HTTP), campaigns via `prisma.campaign`
- **CrmService**: clusters/timeline/notes/forecast/leads via Prisma, `autoCreateLead` e `whatsappIncoming` com criação real de User + TimelineEvent
- **ReportsService**: sumários e categorias computados de `prisma.orderItem.aggregate`
- **AdminService**: métricas de `prisma.order.aggregate`, users de `prisma.user`, activity de `prisma.activityLog`
- Seed expandido: notificações, campanhas, picks, activity logs

## [3.0.0] — 2026-07-22

### Adicionado (Sprints 19-20)

#### Sprint 19 — Pendências Técnicas
- GROQ_API_KEY configurada no Firebase Secret Manager
- Cloud Function `callGroq` buildada e deployada (requer permissão IAM Cloud Build)
- TypeScript strict mode: tipagem corrigida na Cloud Function
- Frontend e Backend com typecheck limpo (`tsc --noEmit` sem erros)

#### Sprint 20 — Chatbot→CRM + WhatsApp
- Backend: `POST /crm/auto-create-lead` — cria lead automaticamente via chatbot com atribuição round-robin
- Backend: `POST /crm/whatsapp/incoming` — webhook mock que cria lead ou associa mensagem a cliente existente
- Backend: Round-robin automático entre vendedores (Carlos Vendas, Ana Operadora)
- Frontend: Chatbot envia dados para API ao final da triagem e exibe "vendedor entrará em contato"
- Frontend: Aba "WhatsApp" no perfil 360° do cliente com conversas mock e botão "Abrir WhatsApp"
- AI: Prompt Groq aprimorado com perguntas de qualificação (CNPJ, segmento, necessidade principal)

### Melhorado
- CrmService ampliado com 2 novos endpoints de automação de leads
- Cache in-memory com fallback preservado para operação sem Redis

## [2.0.0] — 2026-07-22

### Adicionado (Sprints 9-18)

#### Sprints 12-18 — Workflow Orientation & CRM Avançado
- CRM enriquecido: clusterização por ticket, frequência e segmento
- Perfil 360° do cliente com timeline, pedidos, orçamentos e notas
- Sidebar por papel (Admin/Manager/Operator/Cliente) com redirect pós-login
- Sistema de notificações com NotificationBell e 6 regras de salvaguarda
- Landing adaptativa por papel e onboarding tour
- Métricas de vendas: funil, ranking vendedores, projeção de receita

#### Sprint 9 — Super Admin
- Painel Administrativo com 6 KPIs, 3 gráficos (bar, doughnut, line) e cards SLA
- RBAC com 4 papéis (admin, manager, operator, cliente) e 10 recursos
- Gerenciamento de usuários com alteração de papel via dropdown
- Feed de atividades recentes
- CSS refatorado em 7 arquivos temáticos
- Layout responsivo: desktop (sidebar) e mobile (bottom nav + drawer)

#### Sprint 10 — API B2B
- Swagger UI em `GET /api/docs` com OpenAPI 3.0
- Middleware de autenticação via API Key (header `x-api-key`)
- Decorator `@Public()` para rotas públicas
- Especificação OpenAPI em `docs/api-docs/openapi.yaml`

#### Sprint 11 — Mobile-first
- Suporte a telas < 375px (iPhone SE)
- Safe area para dispositivos com notch (`env(safe-area-inset-*)`)
- PWA manifest com ícones maskable e orientação any

### Melhorado
- Chunk splitting: todas as páginas lazy-loaded com React.lazy + Suspense
- Cache in-memory com suporte a Redis via REDIS_URL
- CSP Headers e Content Security Policy no Firebase Hosting
- Carregamento inicial reduzido com code-splitting por rota

## [1.0.0] — 2026-07-21

### Adicionado (Sprints 5-8)

#### Sprint 5 — Módulo de Retenção (Churn)
- API de risco de churn (`GET /churn/risks`, `/churn/summary`)
- Gerenciamento de campanhas (`GET/POST /churn/campaigns`, `POST /churn/trigger/:id`)
- Dashboard de churn com gráficos e métricas
- Cálculo de score por dias inativo (baixo/médio/alto)

#### Sprint 6 — Integração Almoxarifado (Picking)
- API de separação (`GET/POST /warehouse/picks`)
- Eventos de picking via EventEmitter (mock Pub/Sub)
- Consumer de eventos (start, done, error)
- Monitor de picking com auto-refresh 5s e barra de progresso

#### Sprint 7 — Relatórios Avançados
- API de relatórios (`GET /reports/summary`, `/sales`, `/categories`, `/top-products`)
- Exportação CSV com BOM UTF-8
- Layout de impressão com cabeçalho corporativo
- Filtros por período mensal

#### Sprint 8 — Performance e Segurança
- Code-splitting com React.lazy + Suspense em todas as 9 rotas
- Cache Service com suporte a Redis (in-memory fallback)
- Health check (`GET /health`) e cache stats (`GET /cache/stats`)
- Script de load test k6 (rampa 20→200 RPS)

## [0.1.0] — 2026-07-14

### Adicionado (Sprints 0-4)

#### Sprint 0 — Preparação
- Definição de stack: React 18 + NestJS + PostgreSQL + Firebase
- Monorepo com workspaces npm
- Docker Compose (PostgreSQL + Redis)
- ESLint, Prettier, convenções de commit

#### Sprint 1 — Fundamentos MVP
- Frontend React + Vite + PWA (Service Worker, manifest)
- Backend NestJS + Prisma (schema: User, Product, Order, OrderItem)
- Firebase: Auth, Firestore, Hosting, Cloud Function `callGroq`
- Componentes de chat com Firestore `onSnapshot`
- CI/CD com GitHub Actions

#### Sprint 2 — Chatbot Avançado
- API de pedidos (`GET /orders/:numero`, `/orders`)
- Orçamento com catálogo de produtos e carrinho
- Timeline visual de status de pedido
- Triagem automática multi-etapas (4 passos)
- Prompt Groq refinado para orçamentos e sugestões

#### Sprint 3 — CRM Core
- Kanban com drag-and-drop (@hello-pangea/dnd)
- CRUD de clientes (`GET/POST/PATCH/DELETE /customers`)
- Dashboard com gráficos Chart.js
- Modo dark/light com CSS vars e localStorage

#### Sprint 4 — Polimento MVP
- PWA Install Prompt customizado
- Offline Notice (banner vermelho)
- SEO meta tags (Open Graph, Twitter Card)
- Skip link, ARIA roles, focus-visible
- Micro-animações (fadeIn, slideUp, messageIn)
- `docs/deployment.md` com guia completo de deploy
