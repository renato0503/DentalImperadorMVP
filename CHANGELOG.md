# Changelog — Dental Imperador

Todas as alterações notáveis do projeto serão documentadas neste arquivo.

## [2.0.0] — 2026-07-22

### Adicionado (Sprints 9-11)

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
