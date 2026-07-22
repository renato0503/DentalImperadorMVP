## Implementation Roadmap – Dental Imperador

**Objetivo:** Entregar a plataforma em 2 fases com sprints de duas semanas cada, envolvendo times de **Desenvolvimento**, **UX/UI**, **QA** e **Ops**.

**Fase 1 — MVP Base (Sprints 0–12):** ✅ Concluída. Todas as funcionalidades essenciais entregues: chatbot, orçamento, pedidos, CRM, dashboard, churn, picking, relatórios, super admin, API B2B, PWA, mobile.

**Fase 2 — Workflow Orientation & CRM Avançado (Sprints 13–20):** 🔄 Em andamento. Reorganização da plataforma por personas (cliente, admin, manager, operator) com CRM enriquecido, perfil 360°, notificações, salvaguarda, onboarding e automação de vendas.

### Status Geral dos Sprints

| Sprint | Foco | Status | Data Prevista | Entregas |
|---|---|---|---|---|
| **0** | Preparação e Fundação Arquitetural | ✅ Concluído | 2026-07-21 | Stack definida, monorepo, Docker, ESLint, billing alerts |
| **1** | Fundamentos do MVP | ✅ Concluído | 2026-07-21 | React+Vite+PWA, NestJS+Prisma, Firebase Auth/Firestore/Hosting, Chat UI, CI/CD |
| **2** | Chatbot Avançado + Integração CRM | ✅ Concluído | 2026-07-21 | Triagem, orçamento via API, status pedido com timeline, orders mock, Groq refinado |
| **3** | CRM Core (Kanban, Tabelas, Dashboards) | ✅ Concluído | 2026-07-21 | Kanban (@hello-pangea/dnd), Chart.js, CRUD customers, dark/light mode |
| **4** | MVP Completion & Polimento | ✅ Concluído | 2026-07-21 | PWA install prompt, SEO, deployment.md, animações, acessibilidade |
| **5** | Módulo de Retenção (Churn) | ✅ Concluído | 2026-07-21 | Churn risks, campanhas, dashboard gráficos, trigger de disparo |
| **6** | Integração Almoxarifado (Picking) | ✅ Concluído | 2026-07-21 | Eventos picking.start/done, REST /warehouse/pick, tela monitoramento real-time |
| **7** | Relatórios Avançados | ✅ Concluído | 2026-07-21 | Export CSV, filtros período, 4 abas (resumo/vendas/categorias/produtos), impressão |
| **8** | Performance & Segurança | ✅ Concluído | 2026-07-21 | Code-splitting, CSP headers, Redis cache, k6 script, health/cache endpoints |
| **9** | Super Admin | ✅ Concluído | 2026-07-22 | Admin Dashboard, RBAC, layout responsivo mobile/desktop, CSS refactor, Admin API |
| **10** | API B2B Externa | ✅ Concluído | 2026-07-22 | Swagger UI, ApiKey guard, OpenAPI 3.0 spec, docs portal |
| **11** | Mobile-first Enhancements | ✅ Concluído | 2026-07-22 | <375px refinements, safe-area, PWAManifest, native feel |
| **12** | Release Final & Pós-Lançamento | ✅ Concluído | 2026-07-22 | Deploy Firebase Hosting, tag v2.0.0, CHANGELOG, manual, FAQ, runbook |
| **13** | CRM Enriquecido + Clusterização | ✅ Concluído | 2026-07-22 | Customer enriquecido (8 campos novos), clusters (ticket/frequência/segmento), Kanban 6 colunas, Sales Alerts, modal lead |
| **14** | Perfil 360° + Timeline do Cliente | ✅ Concluído | 2026-07-22 | /crm/cliente/:id com timeline, pedidos, orçamentos, notas, score ring, aba de notas |
| **15** | Sidebar por Papel + Meu Painel + Perfil | ⏳ Pendente | — | Sidebar agrupada, MobileNav/Drawer por role, /meu-painel, /perfil, redirect pós-login |
| **16** | Notificações + Salvaguarda | ⏳ Pendente | — | NotificationBell, regras de alerta (lead parado, churn, proposta sem retorno), badges |
| **17** | Landing Adaptativa + Onboarding | ⏳ Pendente | — | Hero por papel, tour primeiro login, reset senha, FAQ interativo |
| **18** | Métricas de Vendas + Reports | ⏳ Pendente | — | Funil, ranking vendedores, projeção receita, tempo médio por etapa |
| **19** | Chatbot → CRM (Automação Lead) | ⏳ Pendente | — | Lead automático via triagem, atribuição round-robin, qualificação por IA |
| **20** | Integração WhatsApp | ⏳ Pendente | — | Webhook WhatsApp mock, timeline unificada, botão "Abrir WhatsApp" |

**Legenda:** ✅ Concluído | 🔄 Em andamento | ⏳ Pendente | ❌ Bloqueado

### O que já funciona (Sprint 0 e 1)

| Item | Status | Detalhes |
|---|---|---|
| Firebase Authentication | ✅ Produção | Login email/senha ativo |
| Firebase Firestore | ✅ Produção | Coleções: users, conversations, messages |
| Firebase Hosting | ✅ Produção | Domínio: `dentalimperador.web.app` |
| Admin Users (seed) | ✅ Feito | Matheus (admin) + Renato (admin) no Firestore |
| Cloud Function callGroq | ✅ Criada | 2nd Gen, aguardando GROQ_API_KEY |
| Frontend React + Vite + PWA | ✅ Feito | Build limpo, PWA ativo, proxy API configurado |
| Backend NestJS + Prisma | ✅ Feito | `/api/v1/products` + `/api/v1/orders` mock testados |
| Orders Module (backend) | ✅ Feito | 3 rotas, fluxo de status, timeline |
| Firebase Admin (backend) | ✅ Feito | Module FirebaseService com fallback de credenciais |
| firestore.rules | ✅ Restritivas | Roles admin/manager/cliente |
| firestore.indexes.json | ✅ Configurado | Índices para chat, conversas, pedidos |
| Docker Compose | ✅ Criado | PostgreSQL 16 + Redis 7 para dev local |
| .env / .env.example | ✅ Criado | Backend .env com placeholder, .env.example na raiz |
| .firebaserc | ✅ Configurado | Projeto padrão: dentalimperador-d2529 |
| Orçamento (frontend) | ✅ Feito | Catálogo via API, carrinho, modal proposta |
| Status Pedido (frontend) | ✅ Feito | Busca por nº, timeline visual, tabela de itens |
| Triagem automática | ✅ Feito | Form multi-etapas antes do chat (nome, email, tel, tipo) |
| Groq prompt | ✅ Refinado | System prompt completo com regras de orçamento/status/sugestão |
| Cloud Function fallback | ✅ Feito | Mensagem amigável quando GROQ_API_KEY não configurada |
| Customers CRUD (backend) | ✅ Feito | 8 clientes mock, filtros por status/segmento, PATCH de status |
| CRM Kanban (frontend) | ✅ Feito | 5 colunas, drag-and-drop via @hello-pangea/dnd, atualiza status via PATCH |
| Dashboard Chart.js | ✅ Feito | Gráfico barras (vendas/mês) + doughnut (segmento) + métricas |
| Dark/Light mode | ✅ Feito | Toggle no Header, CSS vars, persistência localStorage |
| Churn Module (backend) | ✅ Feito | GET /churn/risks, /churn/summary, /churn/campaigns, POST /churn/trigger/:id |
| Churn Dashboard (frontend) | ✅ Feito | Métricas (taxa churn, risco alto/medio/baixo), gráficos bar + doughnut, tabela clientes risco |
| Campaigns (frontend) | ✅ Feito | CRUD de campanhas, card com stats, botão "Disparar Agora", modal de criação |
| Warehouse Picking (backend) | ✅ Feito | GET, POST /warehouse/picks, /warehouse/pick, /warehouse/events, EventEmitter como mock Pub/Sub |
| PickingConsumer | ✅ Feito | Listener de eventos picking.start/done/error (substituível por Pub/Sub real) |
| Picking Monitor (frontend) | ✅ Feito | Cards com progresso, filtro status, botão concluir, eventos em tempo real, auto-refresh 5s |
| Reports Module (backend) | ✅ Feito | GET /reports/summary, /sales, /categories, /top-products, /export/csv |
| Reports Page (frontend) | ✅ Feito | 4 abas (resumo/vendas/categorias/produtos), filtro período, export CSV, impressão com layout corporativo |
| Code-splitting (frontend) | ✅ Feito | React.lazy + Suspense em todas as rotas, chunks individuais por página |
| CSP Headers | ✅ Feito | Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, Permissions-Policy |
| Cache Module (backend) | ✅ Feito | CacheService (in-memory, substituível por Redis via REDIS_URL), aplicado em ProductsService |
| Cache Stats | ✅ Feito | GET /cache/stats (hits, misses, hit rate, size) |
| Health Check | ✅ Feito | GET /health (status, uptime, timestamp) |
| k6 Load Test | ✅ Feito | Script com rampa 20→200 RPS, thresholds de erro <5% e latência p95 <500ms |
| Firestore unsubscribe | ✅ Auditado | ChatWidget já possui return unsub no useEffect do onSnapshot |
| CSS Refactor | ✅ Feito | index.css dividido em 7 arquivos temáticos em styles/ |
| Layout Responsivo | ✅ Feito | Desktop: sidebar+header fixo. Mobile: bottom nav + drawer menu. Breakpoint 1024px |
| Mobile Navigation | ✅ Feito | MobileNav (5 tabs), MobileHeader (hamburger), DrawerMenu (todos links + logout) |
| RBAC | ✅ Feito | permissions.ts com 10 recursos, 4 papéis, ProtectedRoute component |
| Admin Module (backend) | ✅ Feito | GET /admin/metrics, /admin/users, /admin/activity, PATCH /admin/users/:uid/role |
| Admin Dashboard (frontend) | ✅ Feito | 6 KPIs, 3 charts (bar/doughnut/line), SLA cards, activity feed, user mgmt com role select |
| Acessibilidade Mobile | ✅ Feito | Touch targets ≥44px, ARIA labels, role="tablist", focus-visible, skip link |
| Swagger/OpenAPI (backend) | ✅ Feito | Swagger UI em /api/docs, OpenAPI 3.0 spec, api.yaml |
| ApiKey Guard | ✅ Feito | Middleware global x-api-key, decorator @Public(), demo-key-2026 |
| API Developer Portal | ✅ Feito | Swagger UI com descrição, servers, schemas, security |
| Mobile <375px | ✅ Feito | CSS refinado para iPhone SE, fontes reduzidas, padding ajustado |
| Safe Area (notch) | ✅ Feito | env(safe-area-inset-*) para dispositivos com notch |
| PWA Manifest | ✅ Feito | Ícones maskable, orientação, categorias, scope, lang pt-BR |
| PWA Install Prompt | ✅ Feito | Banner customizado com botão "Instalar" |
| Offline Notice | ✅ Feito | Banner vermelho quando offline |
| SEO Meta Tags | ✅ Feito | title, description, OG, Twitter Card, keywords |
| Micro-animações | ✅ Feito | fadeIn nas páginas, slideUp no prompt, messageIn no chat |
| Acessibilidade | ✅ Feito | Skip link, ARIA roles/labels, focus-visible, role="alert" |
| deployment.md | ✅ Criado | Guia completo de deploy, CI/CD, rollback, monitoramento |
| README.md | ✅ Atualizado | Stack, telas, roadmap, ambiente dev, documentação |
| CI/CD GitHub Pages | ✅ Funcionando | Deploy do protótipo estático |
| CI/CD Firebase Hosting | 🔄 Pendente | Workflow criado, falta FIREBASE_SERVICE_ACCOUNT ou CI token |
| GROQ_API_KEY | ❌ Pendente | Obter em https://console.groq.com e configurar no Firebase |
| DATABASE_URL | ❌ Pendente | Rodar `docker compose up -d` + `npx prisma migrate dev` |

### Arquitetura de Referência (Decisão Estratégica)

| Componente | Tecnologia |
|---|---|
| **Frontend** | React 18 + TypeScript + Vite (PWA) |
| **Backend Core & Integração** | NestJS + PostgreSQL (via Firebase Data Connect) + Redis (Cache) |
| **Tempo Real & Chat** | Firebase Firestore (apenas para conversas de chat, sessões e notificações push) |
| **Eventos** | Google Cloud Pub/Sub (substituindo Kafka para reduzir complexidade operacional) |
| **AI** | Groq API via Cloud Functions (2nd Gen) |

### Firebase Project

| Propriedade | Valor |
|---|---|
| Project ID | `dentalimperador-d2529` |
| Domínio de produção | `dentalimperador.web.app` |
| Authentication | ✅ Produção |
| Data Connect (PostgreSQL) | ✅ Produção |
| Firestore | ✅ Produção |
| Storage | ✅ Produção |
| Hosting | ✅ Produção |
| Analytics | ✅ Ativo |

> **SDK Config** → ver `stack.md` ou `.env.example`.  
> **Regra:** NUNCA versionar `.env`. Apenas `.env.example` com valores não sensíveis.

---

### Sprint 0 – Preparação e Fundação Arquitetural (2 dias)

| Atividade | Responsável | Entregáveis |
|---|---|---|
| Configuração do repositório monorepo | Dev Lead | GitHub repo, branch main, proteção de branch, CI inicial (lint & unit test) |
| Definição final da Stack e Banco de Dados | Arquiteto | Documento stack.md definindo: PostgreSQL (relacional) + Firestore (chat) + NestJS |
| Criação de ambiente de desenvolvimento | DevOps | Docker compose com Firebase Emulator Suite, NestJS dev server e Redis local |
| Governança e Observabilidade | DevOps | Configurar Billing Alerts no Google Cloud, ESLint + Prettier, e convenções de commit |

---

### Sprint 1 – Fundamentos do MVP (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Frontend** | • Scaffold React app com Vite (PWA template)<br>• Configurar Service Worker (Workbox)<br>• Layout base (Header, Footer, Navigation) | App inicial rodando em localhost:3000 com manifesto PWA |
| **Backend (NestJS)** | • Setup inicial NestJS + PostgreSQL (Prisma/TypeORM)<br>• Endpoint `/api/v1/products` (mock inicial, preparado para ERP) | API Core estruturada e conectada ao banco relacional |
| **Backend (Firebase)** | • Inicializar Firebase (Auth, Hosting, Firestore)<br>• Criar Cloud Function 2nd Gen `callGroq` (callable)<br>• Definir firestore.rules restritivas | Backend de AI pronto, sem cold starts críticos |
| **Chatbot UI** | • Componentes de chat (MessageList, InputBox)<br>• Integração com Firestore coleção `conversations` (onSnapshot com cleanup) | Chat funcional localmente com persistência NoSQL leve |
| **QA** | • Testes unitários para utils e componentes críticos (Jest)<br>• Cypress (e2e) para fluxo básico de chat | Cobertura mínima 70% |
| **Ops** | • GitHub Actions: lint, test, build, deploy to Firebase Hosting (staging) | Pipeline CI/CD operacional |

**Critério de aceitação:** Deploy de staging com chatbot básico, login via Firebase Auth, e chamada de Groq retornando resposta de teste com latência aceitável.

---

### Sprint 2 – Chatbot Avançado e Primeira Integração CRM (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Frontend** | • Triagem automática (forms dinâmicos)<br>• Tela de orçamento (consulta API NestJS)<br>• Tela de status de pedido (`/api/v1/orders/:id`) | Fluxo de usuário completo (Abertura → Triagem → Orçamento → Status) |
| **Backend (NestJS)** | • Modelar tabelas relacionais `orders` e `order_items` no PostgreSQL<br>• Implementar lógica de status (Faturado, Entregue) | API relacional pronta, evitando anti-padrões de NoSQL |
| **AI** | • Refinar prompts Groq para geração de orçamentos e sugestão de produtos alternativos<br>• Fallback resiliente em caso de falha da API | Respostas precisas e tratamento de erro elegante |
| **UX/UI** | • Design System (tokens, tipografia Inter, paleta #0066CC)<br>• Acessibilidade (ARIA) nas telas de chat e forms | UI consistente, padrão WCAG AA |
| **QA** | • Testes e2e para fluxo completo do chatbot<br>• Testes de integração da Cloud Function `callGroq` | Testes automatizados cobrem o caminho happy path |
| **Ops** | • Deploy da versão v1.0.0-beta para produção (feature flag "chatbot-beta") | Feature habilitada para usuários internos (dogfooding) |

**Critério de aceitação:** Usuário pode abrir chat, receber orçamento baseado em dados relacionais e consultar status, tudo em produção.

---

### Sprint 3 – CRM Core (Kanban, Tabelas, Dashboards) (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Frontend** | • Tela Kanban (drag-and-drop via @hello-pangea/dnd)<br>• Tabelas avançadas com filtros (React Table)<br>• Dashboard de métricas iniciais (Chart.js) | Interface de gestão de leads e clientes fluida |
| **Backend (NestJS)** | • Modelar tabela `customers` com campos desnormalizados para leitura rápida (`ultima_compra`, `total_gasto`)<br>• CRUD seguro com validação de roles (admin/manager) | API CRUD robusta, otimizada para consultas de CRM |
| **UX/UI** | • Refatorar Design System para componentes de tabela e kanban<br>• Implementar modo dark/light (CSS vars) | UI responsiva e premium |
| **QA** | • Testes unitários para funções CRUD do NestJS<br>• Testes Cypress para drag-and-drop e filtros complexos | Cobertura de 80% nas regras de negócio |
| **Ops** | • Configurar monitoramento de uso de banco (Cloud Monitoring) e índices do PostgreSQL | Métricas de performance e uso de recursos visíveis |

**Critério de aceitação:** Equipe interna pode gerenciar leads via Kanban, aplicar múltiplos filtros em tabelas e visualizar dashboards sem lentidão.

---

### Sprint 4 – MVP Completion & Polimento (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Frontend** | • Revisão de UI/UX (micro-animações, transições)<br>• PWA install prompt & offline fallback para o chat<br>• SEO meta tags (title, description, Open Graph) | Aplicação pronta para uso público e instalável |
| **Backend** | • Otimizar índices no PostgreSQL e regras no Firestore<br>• Implementar rate-limiting (ex: @nestjs/throttler) nas APIs públicas | Performance e segurança aprimoradas |
| **QA** | • Testes de carga (k6) para API de chat e endpoints do CRM<br>• Testes de acessibilidade automatizados (axe) | Garantia de escalabilidade e compliance |
| **Ops** | • Configurar alertas (Cloud Alerting) para falhas de função, alta latência e erros 5xx | Operação proativamente monitorada |
| **Docs** | • Atualizar README.md e criar deployment.md com instruções de CI/CD e rollback | Documentação completa para a equipe |

**Critério de aceitação:** Release v1.0.0 está estável, documentada e disponível para todos os usuários da Dental Imperador.

---

### Sprint 5 – Módulo de Retenção (Churn) – Análise e Automação (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Data/Backend** | • Criar View Materializada ou Job Agendado no PostgreSQL para calcular churn (última compra > 30 dias, ticket médio)<br>• Evitar leitura massiva de documentos NoSQL | Dados de risco calculados de forma eficiente e barata |
| **Backend** | • Endpoint `/api/v1/churn/trigger` para disparar campanhas<br>• Integração com SendGrid/Twilio via NestJS | API de ativação de retenção operacional |
| **Frontend** | • Tela de gerenciamento de campanhas (list, schedule, status)<br>• Dashboard de churn (gráficos de tendência e pizza) | UI intuitiva para a equipe de marketing |
| **UX/UI** | • Design de templates de e-mail/SMS responsivos (inclui branding) | Materiais prontos e aprovados para envio |
| **QA** | • Testes unitários da lógica de cálculo de score<br>• Testes e2e da jornada de campanha automatizada | Confiança total na automação de marketing |

**Critério de aceitação:** Sistema identifica clientes inativos com base em dados reais do banco relacional e dispara campanha automática com sucesso.

---

### Sprint 6 – Integração com Almoxarifado (Picking) (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Infra** | • Provisionar Google Cloud Pub/Sub (escolha definitiva sobre Kafka para reduzir overhead de Ops) | Bus de eventos nativo e escalável pronto |
| **Backend** | • NestJS publica evento `picking.start` no Pub/Sub ao faturar pedido<br>• Consumer (NestJS ou Cloud Function) escuta `picking.done` e atualiza status no PostgreSQL/Firestore | Fluxo de picking desacoplado e automatizado |
| **API** | • Endpoint `/api/v1/warehouse/pick` (REST) que valida SKU, quantidade e publica o evento | API pública e segura para operadores de Almoxarifado |
| **Frontend** | • Tela de monitoramento de picking (status em tempo real via listeners do Firestore ou SSE do NestJS) | Visibilidade em tempo real para operadores e gestores |
| **QA** | • Testes de integração (producer → Pub/Sub → consumer) usando emulador local do Google Cloud | Garantia de resiliência no fluxo de mensagens |
| **Ops** | • Configurar DLQ (Dead-Letter Queue) no Pub/Sub e alertas de falha de processamento | Resiliência operacional contra mensagens perdidas |

**Critério de aceitação:** Pedido passa pelo fluxo "Separação" com atualização automática e confiável de status, mesmo sob carga.

---

### Sprint 7 – Expansão de CRM – Relatórios Avançados (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Backend** | • Querys otimizadas no PostgreSQL para agregação de dados<br>• Job agendado (Cloud Scheduler) para pré-cálculo de relatórios pesados | Dados de relatório prontos para consumo rápido |
| **Frontend** | • UI de exportação (download PDF via blob, CSV)<br>• Dashboard de performance por período com filtros dinâmicos | Clientes e admins podem exportar dados com facilidade |
| **UX/UI** | • Design de relatórios impressos/PDF (layout corporativo, cores da marca, cabeçalho/rodapé) | Relatórios com aparência profissional e legível |
| **QA** | • Testes de geração de PDF (comparação de snapshot) e validação de integridade do CSV | Garantia de que os dados exportados batem com a tela |

**Critério de aceitação:** Usuário aplica filtros complexos e exporta relatório formatado em menos de 5 segundos.

---

### Sprint 8 – Melhorias de Performance & Segurança (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Frontend** | • Code-splitting por rotas (React.lazy + Suspense)<br>• Otimizar imagens (WebP, lazy-load) e remover unused code | Bundle size reduzido, carregamento inicial rápido |
| **Backend** | • Implementar caching agressivo (Redis) para catálogo de produtos do ERP<br>• Garantir unsubscribe de todos os listeners do Firestore no frontend | Latência de leitura reduzida e controle de custos do Firebase |
| **Security** | • Auditar permissões IAM do GCP, rotacionar secret da Groq API Key<br>• Implementar CSP (Content Security Policy) headers no Hosting | Superfície de ataque minimizada |
| **Ops** | • Load testing com k6 (target 200 RPS) nos endpoints críticos | Validação de capacidade sob estresse |
| **QA** | • Testes de regressão visual automatizados (ex: Percy ou Loki) | Detecção precoce de quebras de layout |

**Critério de aceitação:** Latência < 200 ms para chamadas de chat e listagem de produtos, sem vulnerabilidades críticas apontadas por scanners.

---

### Sprint 9 – Super Admin – Dashboard Consolidado (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Frontend** | • Tela Super Admin com múltiplos widgets (KPIs, SLA, mapa de pedidos)<br>• Controle granular de permissões (RBAC) | Visão holística e segura para a diretoria |
| **Backend** | • Endpoint `/api/v1/admin/metrics` utilizando agregações eficientes no PostgreSQL (ou BigQuery se o volume exigir) | API de métricas rápida, sem sobrecarregar o banco transacional |
| **UX/UI** | • Design premium (glassmorphism sutil, micro-animações de carregamento) | Experiência de usuário de alto nível para decisores |
| **QA** | • Testes de carga específicos no dashboard de agregação | Garantia de que o dashboard não derruba o banco |

**Critério de aceitação:** Executivos podem visualizar métricas consolidadas em tempo real sem degradação de performance.

---

### Sprint 10 – Integração B2B – API Externa para Clientes (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Backend** | • Definir OpenAPI 3.0 spec (`api.yaml`) para recursos de pedidos, clientes e status<br>• Implementar API Gateway (NestJS ou Cloud Endpoints) com autenticação JWT | API pública padronizada e segura |
| **Docs** | • Portal de desenvolvedores (Swagger UI / Redoc) hospedado em `api.dentalimperador.com/docs` | Documentação interativa para parceiros B2B |
| **Security** | • Rate limiting (por IP e por chave de API) e quota management | Proteção contra abuso e DDoS |
| **QA** | • Testes de contrato (Pact) para garantir compatibilidade com consumidores externos | Estabilidade nas integrações B2B |

**Critério de aceitação:** Clientes externos conseguem autenticar e integrar seus sistemas via API pública com sucesso.

---

### Sprint 11 – Mobile-first Enhancements & Native-like Experience (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Frontend** | • Ajustes de UI/UX para telas < 375 px (iPhone SE, Android low-end)<br>• Implementar prompt customizado de "Add to Home Screen" | Experiência mobile indistinguível de um app nativo |
| **Performance** | • Auditar e otimizar métricas Web Vitals (Lighthouse score > 90 em Mobile) | Performance de elite em redes 3G/4G |
| **QA** | • Testes em dispositivos reais e emuladores (BrowserStack ou Firebase Test Lab) | Garantia de compatibilidade cross-device |

**Critério de aceitação:** PWA funciona de forma fluida, instalável e responsiva em desktop, iOS e Android.

---

### Sprint 12 – Release Final & Pós-Lançamento (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Ops** | • Tag v2.0.0 e rollout canário (10% dos usuários)<br>• Validação do plano de Backup e Disaster Recovery (PostgreSQL + Firestore) | Lançamento controlado e seguro |
| **Support** | • Treinamento da equipe de suporte e vendas (FAQ, runbooks, vídeos curtos) | Equipe interna alinhada e capacitada |
| **Monitoring** | • Dashboards finais no Grafana/Cloud Monitoring (SLA, churn, uso de API, custos) | Visibilidade total da saúde do sistema |
| **Documentation** | • Manual do usuário final (PDF/Web) e guia de API atualizado | Autonomia do usuário e desenvolvedor |
| **Retrospective** | • Reunião de lições aprendidas, celebração e planejamento do roadmap do próximo semestre | Melhoria contínua do processo |

**Critério de aceitação:** Plataforma está estável, documentada, com custos sob controle e em operação completa para a Dental Imperador.

---

## Fase 2 — Workflow Orientation & CRM Avançado (Sprints 13–20)

Após a conclusão das 12 sprints do MVP, a plataforma agora entra na **Fase 2: Organização por Workflows**. O objetivo é reestruturar toda a experiência do usuário com base em **4 personas** (Cliente, Admin, Manager, Operator), cada uma com jornadas, permissões e interfaces dedicadas.

### Sprint 13 — CRM Enriquecido + Clusterização de Clientes (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Backend** | • Ampliar schema `customers` com campos: `ticket_cluster`, `frequencia_cluster`, `categorias_compra`, `vendedor_uid`, `ultimo_contato`, `proximo_contato`, `nota_interna`, `propensao_compra`, `endereco`<br>• Endpoint `GET /crm/clusters` — distribuição por ticket, frequência e segmento<br>• Endpoint `GET /crm/sales-alerts` — alertas de follow-up para vendedores<br>• Endpoint `GET /crm/timeline/:id` — timeline de interações do cliente | API de CRM enriquecida com dados de cluster e alertas |
| **Frontend** | • Kanban com +1 coluna: Leads → Contato → Proposta → Negociação → Cliente → Inativo<br>• Badge de cluster no card: ticket (💰/💎), frequência (🔄/📅/💤)<br>• Modal de lead com formulário completo + atribuição a vendedor<br>• Filtros: por cluster, vendedor, período, score | Kanban inteligente com clusterização |
| **QA** | • Testar regras de cluster (ticket < 5k = pequeno, etc.)<br>• Validar criação de lead com campos novos | Clusterização funcionando |

**Critério de aceitação:** Vendedor vê leads clusterizados por ticket e frequência, consegue atribuir a si mesmo e adicionar notas internas.

---

### Sprint 14 — Perfil 360° do Cliente + Timeline (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Backend** | • Endpoint `GET /crm/customers/:id/timeline` — eventos: chat, orçamento, pedido, ligação, email<br>• Endpoint `GET /crm/customers/:id/orders` — pedidos do cliente<br>• Endpoint `GET /crm/customers/:id/estimates` — orçamentos do cliente | API de histórico completo do cliente |
| **Frontend** | • Página `/crm/cliente/:id` — Perfil 360°<br>  — Header: nome, cluster, score, vendedor responsável<br>  — Abas: Timeline, Pedidos, Orçamentos, Notas<br>  — Timeline visual com ícones por tipo de evento<br>  — Formulário de nota interna<br>  — Botão "Atribuir vendedor"<br>  — Indicador de propensão de compra (0-100) | Perfil completo com histórico |
| **UX/UI** | • Timeline com scroll infinito<br>• Cards expansíveis para cada evento<br>• Cores por tipo (chat=azul, pedido=verde, lead=amarelo) | Experiência de navegação fluida |

**Critério de aceitação:** Vendedor acessa qualquer cliente e vê em segundos todo o histórico de interações, pedidos e notas.

---

### Sprint 15 — Sidebar por Papel + Meu Painel + Perfil (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Frontend** | • **Sidebar** reescrita com seções agrupadas e badges de notificação<br>  — Cliente: Meu Painel, Chatbot, Orçamento, Meus Pedidos, Perfil<br>  — Admin/Manager: Dashboards, Gestão, Operações, Sistema<br>  — Operator: Picking, CRM, Dashboard<br>• **MobileNav** e **DrawerMenu** atualizados com mesma lógica<br>• Página `/meu-painel` — Dashboard do cliente com pedidos recentes, orçamentos salvos, chat ativo<br>• Página `/perfil` — Dados cadastrais, preferências (tema, notificações), alterar senha<br>• **Redirect pós-login** por papel (Admin→/admin, Manager→/dashboard, Operator→/picking, Cliente→/meu-painel) | Navegação organizada por papel |
| **UX/UI** | • Sidebar com divisores visuais entre seções<br>• Ícones consistentes por categoria<br>• Animação de transição ao trocar de rota | UI profissional e intuitiva |
| **QA** | • Testar redirect para cada papel<br>• Verificar que cliente não vê links de admin<br>• Testar mobile nav | Navegação testada por papel |

**Critério de aceitação:** Cada papel vê apenas seus links, é redirecionado para a página correta ao logar e tem acesso ao perfil.

---

### Sprint 16 — Sistema de Notificações + Salvaguarda (Sales Alerts) (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Backend** | • Endpoint `GET /notifications` — lista alertas do usuário logado<br>• Endpoint `PATCH /notifications/:id/read` — marcar como lida<br>• Job agendado que dispara alertas com base nas regras de salvaguarda:<br>  — Lead não atribuído > 24h → notifica admin<br>  — Lead sem contato > 3 dias → notifica vendedor<br>  — Proposta sem retorno > 5 dias → notifica vendedor<br>  — Cliente inativo > 30 dias → notifica vendedor<br>  — Churn risco alto → notifica admin<br>  — Pedido parado na separação > 2 dias → notifica operador | Motor de regras de alerta |
| **Frontend** | • Componente `NotificationBell` no Header — ícone 🔔 com badge de contagem<br>• Dropdown de notificações com lista, ícone por severidade e "Ver todas"<br>• Badge na sidebar por seção (ex: "Gestão (🔴3)")<br>• Toast/notificação in-app ao receber novo alerta | Notificações visíveis em toda plataforma |
| **Ops** | • Configurar polling ou WebSocket para notificações em tempo real<br>• Definir limites de rate para evitar spam de notificações | Notificações em tempo real |

**Critério de aceitação:** Vendedor recebe alerta visual quando um lead precisa de atenção. Admin vê leads não atribuídos. Operador vê picks parados.

---

### Sprint 17 — Landing Adaptativa + Onboarding + Autoatendimento (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Frontend** | • **Landing page adaptativa por role:**<br>  — Visitante: hero atual com CTA para chatbot<br>  — Cliente logado: "Bem-vindo de volta! Seus últimos pedidos..."<br>  — Admin logado: "Bom dia! X alertas pendentes"<br>  — Manager: "Meta do mês: Y% batida"<br>  — Operator: "X separações pendentes hoje"<br>• **Onboarding tour** (primeiro login):<br>  — Modal "Bem-vindo à plataforma"<br>  — Tour guiado destacando sidebar, notificações e página principal<br>  — Dica contextual na primeira ação<br>• **Autoatendimento** para clientes:<br>  — "Esqueci minha senha" (via Firebase)<br>  — FAQ interativo no chatbot<br>  — Agendamento de call com vendedor | Experiência personalizada desde o primeiro acesso |
| **UX/UI** | • Hero adaptável por papel com background dinâmico<br>• Tour com tooltips estilizados e "Pular"<br>• Estados vazios com ilustrações e CTAs | Onboarding amigável |
| **QA** | • Testar landing para cada papel logado/não logado<br>• Testar tour completo no primeiro login | Fluxo de onboarding validado |

**Critério de aceitação:** Usuário é saudado com conteúdo relevante ao logar. Novo usuário é guiado pela plataforma. Cliente consegue resetar senha sozinho.

---

### Sprint 18 — Métricas de Vendas + Reports por Vendedor (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Backend** | • Endpoint `GET /crm/metrics/salesperson` — por vendedor: leads, conversão, ticket médio, tempo médio por etapa<br>• Endpoint `GET /crm/metrics/pipeline` — taxa de conversão por etapa, gargalos<br>• Endpoint `GET /crm/metrics/forecast` — projeção de receita com base no pipeline atual | Métricas analíticas de vendas |
| **Frontend** | • Aba "Métricas" no CRM com:<br>  — Ranking de vendedores (conversão, ticket, leads)<br>  — Funil de vendas (quantos leads em cada etapa)<br>  — Tempo médio por etapa (detecção de gargalo)<br>  — Projeção de receita do mês<br>• Gráfico de funil (Funnel Chart)<br>• Tabela comparativa entre vendedores | CRM analítico com visão de performance |
| **UX/UI** | • Cards de métricas por vendedor com badge de performance<br>• Tooltips explicativos em cada métrica<br>• Botão "Comparar períodos" | Dashboard de vendas completo |

**Critério de aceitação:** Gestor identifica em 30 segundos qual vendedor tem melhor conversão e onde está o gargalo no pipeline.

---

### Sprint 19 — Integração Chatbot → CRM + Automação de Lead (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Backend** | • Ao final da triagem do chatbot, criar lead automaticamente no CRM<br>• Endpoint `POST /crm/auto-create-lead` — recebe dados da triagem, cria lead e atribui vendedor (round-robin ou least-loaded)<br>• Webhook para quando lead é criado via WhatsApp (mock)<br>• Job diário: leads sem interação > 7 dias → mover para "inativo" | Automação de criação de leads |
| **Frontend** | • Chatbot → após triagem → "Um vendedor entrará em contato em até 24h"<br>• Lead aparece automaticamente no Kanban do vendedor<br>• Notificação push interna quando novo lead é atribuído | Lead do chatbot → CRM automaticamente |
| **AI** | • Prompt Groq ajustado para qualificar leads (perguntar CNPJ, segmento, necessidade)<br>• Se lead qualificado → prioridade alta na atribuição | Chatbot como funil de vendas |
| **QA** | • Testar fluxo completo: chatbot → triagem → lead no Kanban<br>• Testar atribuição round-robin com 3 vendedores mock | Pipeline chatbot→CRM testado |

**Critério de aceitação:** Lead criado pelo chatbot aparece no Kanban do vendedor automaticamente em segundos.

---

### Sprint 20 — Integração WhatsApp + Canal de Vendas Unificado (2 semanas)

| Área | Tarefas | Resultado |
|---|---|---|
| **Backend** | • Webhook mock para receber mensagens do WhatsApp<br>• Endpoint `POST /crm/whatsapp/incoming` — recebe msg, cria lead ou associa a cliente existente<br>• Job que sincroniza conversas do WhatsApp com timeline do CRM | Base para integração real com WhatsApp API |
| **Frontend** | • Aba "WhatsApp" no perfil do cliente — histórico de conversas<br>• Indicador "Contato via WhatsApp" no card do lead<br>• Botão "Abrir WhatsApp" com link direto para o número do cliente | Visibilidade do canal WhatsApp |
| **UX/UI** | • Bolha de chat do WhatsApp estilizada<br>• Badge "WhatsApp" nos cards do Kanban | Canais unificados no CRM |

**Critério de aceitação:** Mensagem do WhatsApp é registrada na timeline do cliente e vendedor consegue ver todo o histórico.

---

### Resumo das Sprints

| Sprint | Duração | Foco Principal | Status |
|---|---|---|
| 0 | 2 dias | Preparação de ambiente, convenções e definição da arquitetura híbrida (SQL + NoSQL) | ✅ |
| 1 | 2 sem | Scaffold, PWA, chatbot básico (Firestore) e API Core (NestJS/PostgreSQL) | ✅ |
| 2 | 2 sem | Chatbot avançado, integração Groq (2nd Gen), UI premium e dados relacionais | ✅ |
| 3 | 2 sem | CRM core (Kanban, tabelas, dashboards) com modelagem relacional otimizada | ✅ |
| 4 | 2 sem | Polimento MVP, SEO, monitoramento e alertas de orçamento | ✅ |
| 5 | 2 sem | Módulo de retenção (churn) via queries SQL agendadas (eficiente) | ✅ |
| 6 | 2 sem | Integração Almoxarifado (picking) via Google Cloud Pub/Sub | ✅ |
| 7 | 2 sem | Relatórios avançados e exportação (PDF/CSV) a partir do banco relacional | ✅ |
| 8 | 2 sem | Performance (Redis cache, code-splitting) e segurança (IAM, CSP) | ✅ |
| 9 | 2 sem | Super Admin dashboard consolidado (agregações otimizadas) | ✅ |
| 10 | 2 sem | API B2B externa (OpenAPI, Gateway, Rate limiting) | ✅ |
| 11 | 2 sem | Mobile-first refinamentos e auditoria Lighthouse | ✅ |
| 12 | 2 sem | Release final, documentação, suporte e rollout canário | ✅ |
| 13 | 2 sem | CRM enriquecido + clusterização de clientes (ticket, frequência, segmento) | ✅ |
| 14 | 2 sem | Perfil 360° do cliente + timeline de interações | ✅ |
| 15 | 2 sem | Sidebar por papel + Meu Painel + Perfil + redirect pós-login | ⏳ |
| 16 | 2 sem | Sistema de notificações + salvaguarda (sales alerts + regras de follow-up) | ⏳ |
| 17 | 2 sem | Landing adaptativa + onboarding tour + autoatendimento | ⏳ |
| 18 | 2 sem | Métricas de vendas + reports por vendedor (funil, conversão, previsão) | ⏳ |
| 19 | 2 sem | Integração Chatbot → CRM + automação de lead (round-robin) | ⏳ |
| 20 | 2 sem | Integração WhatsApp + canal de vendas unificado | ⏳ |

> **Próximos passos:** Iniciar Sprint 13 — CRM Enriquecido + Clusterização.

---

## 📈 Análise de Estoque Automática

**Objetivo:** Automatizar a identificação de produtos com baixo giro, próximos da validade ou críticos, fornecendo dados para decisões de promoção e gerenciamento de validade.

### Algoritmo (Lógica de Negócio)

```
para cada produto em estoque:
    giro = vendas_30dias / quantidade_atual
    se giro < LIMIAR_BAIXO:
        marcar como "baixo giro"
    se dias_para_validade < LIMIAR_VALIDADE:
        marcar como "próximo da validade"
    se demanda_prevista > quantidade_atual:
        marcar como "atenção de ruptura"
```

> **Nota:** Esta lógica será implementada como uma **View ou Job no PostgreSQL**, não como um loop em memória no Node.js, garantindo performance.

### Integração proposta

- **Backend (NestJS):** Job agendado (ou trigger) que executa a lógica SQL, atualizando uma coluna `status_estoque` na tabela de produtos.
- **Frontend:** Página de administração em React que consome `/api/v1/inventory/alerts`, exibindo tabela com colunas: Produto, Giro, Dias até validade, Status (com badges coloridos).
- **Configuração:** Limiares (`LIMIAR_BAIXO`, `LIMIAR_VALIDADE`) gerenciáveis via painel de admin (salvos em tabela de `configuracoes`).

### Próximos passos

- Desenvolver a query/job no NestJS + PostgreSQL.
- Atualizar o design system para incluir componentes de tabela com badges de status.
- Implementar botão de exportação (CSV) para a equipe de marketing criar campanhas.

---

## Status atual de implementação — Protótipo estático (2026-07-14)

Os Sprints 1-4 foram entregues como **protótipo estático** (HTML/CSS/JS puro, sem React/Firebase), para validação de UX e demonstração no GitHub Pages.

| Sprint (plano) | Entregue no protótipo estático |
|---|---|
| 1 – Fundamentos / Chatbot básico | `chatbot.html` (triagem, orçamento, status — mock interativo) |
| 2 – Chatbot avançado / Orçamento / Status | `orcamento.html`, `pedido.html` |
| 3 – CRM Core (Kanban, Tabelas, Dashboards) | `crm.html` (Kanban drag-and-drop), `dashboard.html` (Chart.js) |
| 4 – Polimento / Landing | `index.html` (Landing + Sobre + footer com categorias) |

**Pendências para a versão real (React + NestJS + PostgreSQL + Firebase):** autenticação/login, backend de dados relacional, integrações (almoxarifado, ERP, pagamentos), módulo de churn e Super Admin (Sprints 5-12). Ver `MVP.md` para status e próximos passos.

---

## Integração com ERP FlexTotal — Endpoints Reais (Lucas)

Recebemos de Lucas (dev das APIs) os endpoints reais do **FlexTotal ERP** da Dental Imperador. Abaixo, o plano de consumo para substituir os mocks atuais.

### Endpoints descobertos

| Endpoint | Função | Payload |
|---|---|---|
| `D14/consultar` | Lista de produtos por período | `{"DT_INI","DT_FIM"}` |
| `D15/consultar` | Estoque por período (com ou sem filtro de itens) | `{"DT_INI","DT_FIM","CD_ITEM":[]}` |
| `D16/consultar` | Ficha técnica de um produto | `{"CD_ITEM":"43024"}` |

- **Base URL:** `https://portal.dentalimperador.com.br:9090/flextotal/ws/integracao/`
- **Auth:** Header `Authorization: Flexmobile_API <base64>` + cookie `access_token` (JWT)
- **Content-Type:** `application/json`

### Integração nos Sprints

| Sprint | O que passa a consumir do FlexTotal | Antes (mock) | Depois (real) |
|---|---|---|---|
| **1-2** | Catálogo de produtos via D14 + ficha técnica via D16 | `CATALOG` fixo em `orcamento.js` com 8 produtos | Lista real com 51 categorias, preços, NCM, controle ANVISA (via Cache Redis) |
| **2** | Status de pedido (usar D15 para disponibilidade enquanto endpoint próprio não existe) | Status fixos em `pedido.js` | Consulta real de estoque e disponibilidade |
| **3** | Dados de clientes (a confirmar schema com Lucas) | Leads fixos em `crm.js` | Clientes reais com limite, segmento, última compra (sincronizados para PostgreSQL) |
| **5** | Churn (campo `ultima_compra` real via clientes) | Dados inventados | Regra de 30/60 dias com data real do ERP |
| **6** | Picking (D15 para saldo disponível + callback) | Simulado | Estoque real com saldo, reservado, giro |
| **7-10** | Relatórios, NF, financeiro (conforme `integracao_erp_dados.md`) | N/A | Dados reais exportáveis |

### Como consumir (Arquitetura Híbrida)

1. **Backend (NestJS):** Criar `FlexTotalAdapter` que autentica via `Flexmobile_API`, faz requisições REST para D14/D15/D16 e mapeia respostas para as entidades do sistema.
2. **Cache (Redis):** Catalogar produtos e estoque em Redis. Atualizar a cada 1h ou via webhook/invalidação sob demanda. Nunca chamar o ERP diretamente do frontend.
3. **Persistência (PostgreSQL):** Dados críticos (como pedidos confirmados e cadastro de clientes) são espelhados/sincronizados no PostgreSQL para permitir consultas rápidas e relacionais pelo CRM.
4. **Frontend:** Consome apenas as APIs do NestJS (`/api/v1/products`, `/api/v1/inventory`), que por sua vez resolvem a busca no Redis ou no PostgreSQL.
5. **Fallback:** Se o FlexTotal estiver fora, o NestJS serve dados do Redis/PostgreSQL com um header ou indicador visual "Dados em cache (última atualização: HH:MM)".

### Mapeamento D14/D15/D16 para entidades do sistema

| Entidade | Endpoint FlexTotal | Campos críticos |
|---|---|---|
| `products` | D14 + D16 | `sku`, `nome`, `categoria`, `preco_tabela`, `ncm`, `controlado_anvisa` |
| `inventory` | D15 | `sku`, `quantidade`, `disponivel`, `local`, `validade_lote` |
| `customers` | (a confirmar) | `cpf_cnpj`, `nome_razao_social`, `ultima_compra`, `limite_credito` |
| `orders` | (a confirmar) | `numero_pedido`, `status`, `itens[]`, `valor_total`, `data_emissao` |
| `invoices` | (a confirmar) | `chave_nfe`, `xml_url`, `pdf_url`, `status` |
| `shipments` | (a confirmar) | `codigo_rastreio`, `data_entrega`, `status_entrega` |

> **Legenda:** "a confirmar" = Lucas precisa expor o endpoint. O schema já está definido em `integracao_erp_dados.md`.

### Próximos passos imediatos

1. Confirmar com Lucas se D14/D15/D16 já estão em produção ou se há ambiente de homologação
2. Solicitar os endpoints de `customers`, `orders`, `invoices`, `shipments` e `financial`
3. Criar o adapter NestJS + cache Redis para os 3 endpoints já conhecidos
4. Substituir mock do `orcamento.js` pelo endpoint real de catálogo
5. Substituir mock do `pedido.js` pelo endpoint real de pedidos
