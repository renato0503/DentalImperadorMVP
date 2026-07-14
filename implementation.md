## Implementation Roadmap – Dental Imperador

**Objetivo:** entregar a plataforma em 3 fases (MVP, expansão e consolidação) com sprints de duas semanas cada, envolvendo times de **Desenvolvimento**, **UX/UI**, **QA** e **Ops**.

---

### Sprint 0 – Preparação (2 dias)
| Atividade | Responsável | Entregáveis |
|-----------|-------------|-------------|
| Configuração do repositório monorepo | Dev Lead | GitHub repo, branch `main`, proteção de branch, CI inicial (lint & unit test) |
| Definir stack (React 18 + TypeScript, Vite, Firebase, Groq) | Arquiteto | Documento `stack.md` (já entregue) |
| Criação de ambiente de desenvolvimento | DevOps | Docker compose com Firebase emulator, Vite dev server |
| Acordo de convenções de código | Todos | ESLint + Prettier config |

---

## Sprint 1 – Fundamentos do MVP (2 semanas)
| Área | Tarefas | Resultado |
|------|---------|----------|
| **Frontend** | • Scaffold React app com Vite (PWA template)\n• Configurar Service Worker (Workbox)\n• Implementar layout base (Header, Footer, Navigation) | App inicial rodando em `localhost:3000` com manifesto PWA |
| **Backend** | • Inicializar Firebase project (Firestore, Auth, Hosting)\n• Criar Cloud Function `callGroq` (callable) para integração com Groq API\n• Definir regras de segurança (`firestore.rules`) | Backend pronto para receber chamadas de AI |
| **Chatbot UI** | • Componentes de chat (MessageList, InputBox)\n• Integração com Firestore `conversations` collection (real‑time) | Chat funcional localmente |
| **QA** | • escrever testes unitários para utils e componentes críticos (Jest)\n• configurar Cypress (e2e) para fluxo de chat | Cobertura mínima 70 % |
| **Ops** | • Configurar GitHub Actions: lint, test, build, deploy to Firebase Hosting (staging) | Pipeline CI/CD operacional |

**Critério de aceitação:** Deploy de *staging* com chatbot básico, login via Firebase Auth, e chamada de Groq retornando resposta de teste.

---

## Sprint 2 – Chatbot avançado e Primeira Integração CRM (2 semanas)
| Área | Tarefas | Resultado |
|------|---------|----------|
| **Frontend** | • Implementar triagem automática (forms dinâmicos)\n• Tela de orçamento automático (consulta a catálogo em Firestore)\n• Tela de status de pedido (consumo de API `/orders/:id`) | Fluxo de usuário completo (Abertura → Triagem → Orçamento → Status) |
| **Backend** | • Modelar coleção `orders` com status (`Faturado`, `Entregue`, …)\n• Cloud Function `getOrderStatus` (callable)\n• Endpoint REST `/api/v1/products` (listagem) | API pronta para ser consumida pelo chatbot |
| **AI** | • Refinar prompts Groq para geração de orçamentos e sugestão de produtos alternativos\n• Implementar fallback caso Groq falhe (mensagem genérica) | Respostas mais precisas e resilientes |
| **UX/UI** | • Design System (tokens, tipografia Inter, paleta #0066CC)\n• Aplicar acessibilidade (ARIA) nas telas de chat e forms | UI consistente, WCAG AA |
| **QA** | • Testes e2e para fluxo completo do chatbot\n• Testes de integração da Cloud Function (`callGroq`) | Testes automatizados cobrem caminho happy path |
| **Ops** | • Deploy de versão `v1.0.0` para ambiente **produção** (feature flag “chatbot‑beta”) | Feature habilitada para usuários internos |

**Critério de aceitação:** Usuário pode abrir chat, receber orçamento e consultar status, tudo em produção.

---

## Sprint 3 – CRM Core (Kanban, Tabelas, Dashboards) (2 semanas)
| Área | Tarefas | Resultado |
|------|---------|----------|
| **Frontend** | • Tela Kanban (drag‑and‑drop via `react-beautiful-dnd`)\n• Tabelas avançadas com filtros (React Table)\n• Dashboard de métricas (Chart.js) | Interface de gestão de leads e clientes |
| **Backend** | • Modelar coleção `customers` (historico, notas)\n• Cloud Functions CRUD (`createCustomer`, `updateCustomer`, `listCustomers`)\n• Regras de segurança por role (admin/manager) | API CRUD pronta |
| **UX/UI** | • Refatorar design System para componentes de tabela e kanban\n• Implementar modo dark/light (CSS vars) | UI responsiva e premium |
| **QA** | • Testes unitários para funções CRUD\n• Testes Cypress para drag‑and‑drop e filtros | Cobertura de 80 % |
| **Ops** | • Configurar monitoramento de Firestore usage (Firebase Performance) | Métricas de uso em Cloud Monitoring |

**Critério de aceitação:** Equipe interna pode gerenciar leads via Kanban, filtrar tabelas e visualizar dashboards.

---

## Sprint 4 – MVP Completion & Polimento (2 semanas)
| Área | Tarefas | Resultado |
|------|---------|----------|
| **Frontend** | • Revisão de UI/UX (micro‑animações, transições)\n• Implementar PWA install prompt & offline fallback for chat\n• SEO meta tags (title, description, Open Graph) | Aplicação pronta para uso público |
| **Backend** | • otimizar regras Firestore (indexação)\n• Implementar rate‑limiting nas funções públicas (via Cloud Functions `express-rate-limit`) | Performance e segurança aprimoradas |
| **QA** | • Testes de carga (k6) para API de chat\n• Testes de acessibilidade (axe) | Garantia de escalabilidade e compliance |
| **Ops** | • Configurar alertas (Cloud Alerting) para falhas de função e alta latência | Operação monitorada |
| **Docs** | • Atualizar `README.md` e criar `deployment.md` com instruções de CI/CD | Documentação completa |

**Critério de aceitação:** Release `v1.0.0` está estável, disponível para todos os usuários da Dental Imperador.

---

## Sprint 5 – Módulo de Retenção (Churn) – Análise e Automação (2 semanas)
| Área | Tarefas | Resultado |
|------|---------|----------|
| **Data** | • Definir métricas de churn (última compra > 30 dias, ticket médio)\n• Criar Cloud Function `calculateChurnScore` (diariamente)\n• Armazenar score em sub‑coleção `churnScore` | Dados de risco disponíveis em Firestore |
| **Backend** | • Endpoint `/api/v1/churn/trigger` (callable) para disparar campanhas\n• Integração com SendGrid/Twilio via Cloud Functions | API de ativação de retenção |
| **Frontend** | • Tela de gerenciamento de campanhas (list, schedule, status)\n• Dashboard de churn (pie chart, trend) | UI para equipe de marketing |
| **UX/UI** | • Design de email/template de SMS (inclui branding) | Materiais prontos para envio |
| **QA** | • Testes unitários da lógica de score\n• Testes e2e da campanha automatizada | Confiança na automação |

**Critério de aceitação:** Sistema identifica clientes inativos e pode enviar campanha automática.

---

## Sprint 6 – Integração com Almoxarifado (Picking) (2 semanas)
| Área | Tarefas | Resultado |
|------|---------|----------|
| **Infra** | • Provisionar Kafka cluster (Managed Confluent) ou usar Pub/Sub (Google) | Bus de eventos pronto |
| **Backend** | • Cloud Function `triggerPicking` (publish to `picking.start` topic)\n• Consumer Function `processPickingResult` (subscribe `picking.done`) → atualiza ordem no Firestore | Fluxo de picking automatizado |
| **API** | • Endpoint `/api/v1/warehouse/pick` (REST) que valida SKU e quantidade e publica evento | API pública para Almoxarifado |
| **Frontend** | • Tela de monitoramento de picking (status em tempo real via WebSocket/FireStore listeners) | Visibilidade para operadores |
| **QA** | • Testes de integração (producer → consumer) usando local Kafka docker |
| **Ops** | • Configurar DLQ (dead‑letter queue) e alertas de falha | Resiliência operacional |

**Critério de aceitação:** Pedido passa pelo fluxo “Separação” com atualização automática de status.

---

## Sprint 7 – Expansão de CRM – Relatórios avançados (2 semanas)
| Área | Tarefas | Resultado |
|------|---------|----------|
| **Backend** | • Cloud Function `generateReport` (PDF via Puppeteer)\n• Agendamento de relatórios mensais (Cloud Scheduler) | Relatórios automáticos |
| **Frontend** | • UI de exportação (download PDF, CSV)\n• Dashboard de performance por período | Clientes podem exportar dados |
| **UX/UI** | • Design de relatórios (layout corporativo, cores da marca) |
| **QA** | • Testes de geração de PDF (snapshot) |

**Critério de aceitação:** Usuário exporta relatório com dados filtrados.

---

## Sprint 8 – Melhorias de Performance & Segurança (2 semanas)
| Área | Tarefas | Resultado |
|------|---------|----------|
| **Frontend** | • Code‑splitting por rotas (React.lazy + Suspense)\n• Optimizar imagens (WebP, lazy‑load) |
| **Backend** | • Implementar caching (Redis via Cloud Memorystore) para catálogos de produtos\n• Revisar regras Firestore e agregar índices críticos |
| **Security** | • Auditar permissões IAM, rotacionar secret Groq API Key\n• Implementar CSP headers no Hosting |
| **Ops** | • Load testing com k6 (target 200 RPS) |
| **QA** | • Testes de regressão visual (Percy) |

**Critério de aceitação:** Latência < 200 ms para chamadas de chat, sem vulnerabilidades críticas.

---

## Sprint 9 – Super Admin – Dashboard Consolidado (2 semanas)
| Área | Tarefas | Resultado |
|------|---------|----------|
| **Frontend** | • Tela Super Admin com múltiplos widgets (KPIs, SLA, mapa de pedidos)\n• Controle de permissões (RBAC) |
| **Backend** | • Endpoint `/api/v1/admin/metrics` (aggregations via Firestore + BigQuery) |
| **UX/UI** | • Design premium (glassmorphism, micro‑animations) |
| **QA** | • Testes de carga no dashboard (grafana) |

**Critério de aceitação:** Executivos podem visualizar métricas em tempo real.

---

## Sprint 10 – Integração B2B – API Externa para Clientes (2 semanas)
| Área | Tarefas | Resultado |
|------|---------|----------|
| **Backend** | • Definir OpenAPI 3.0 spec (`api.yaml`) para recursos de pedidos, clientes e status\n• Implementar gateway API (Cloud Endpoints) com autenticação JWT |
| **Docs** | • Portal de desenvolvedores (Swagger UI) hospedado no sub‑domínio `api.dentalimperador.com` |
| **Security** | • Rate limiting (per‑IP) e quota management |
| **QA** | • Testes de contrato (pact) |

**Critério de aceitação:** Clientes externos podem integrar via API pública.

---

## Sprint 11 – Mobile‑first Enhancements & Native‑like Experience (2 semanas)
| Área | Tarefas | Resultado |
|------|---------|----------|
| **Frontend** | • Ajustes de UI para telas < 375 px (iPhone SE, Android low‑end)\n• Implementar “Add to Home Screen” prompt customizado |
| **Performance** | • Auditar Lighthouse (score > 90) |
| **QA** | • Testes em dispositivos reais (BrowserStack) |

**Critério de aceitação:** PWA funciona indistintamente em desktop, iOS e Android.

---

## Sprint 12 – Release Final & Pós‑Lançamento (2 semanas)
| Área | Tarefas | Resultado |
|------|---------|----------|
| **Ops** | • Tag `v2.0.0` e rollout canário (10 % usuários)\n• Backup e disaster recovery plan |
| **Support** | • Treinamento da equipe de suporte (FAQ, runbooks) |
| **Monitoring** | • Dashboards finais no Grafana (SLA, churn, uso) |
| **Documentation** | • Manual do usuário (PDF) e guia de API |
| **Retrospective** | • Reunião de lições aprendidas e planejamento de roadmap futuro |

**Critério de aceitação:** Plataforma está estável, documentada e em operação completa.

---

# Resumo das Sprints
| Sprint | Duração | Foco Principal |
|-------|---------|----------------|
| 0 | 2 dias | Preparação de ambiente e convenções |
| 1 | 2 sem | Scaffold, PWA, chatbot básico |
| 2 | 2 sem | Chatbot avançado, integração Groq, UI premium |
| 3 | 2 sem | CRM core (Kanban, tabelas, dashboards) |
| 4 | 2 sem | Polimento MVP, SEO, monitoramento |
| 5 | 2 sem | Módulo de retenção (churn) |
| 6 | 2 sem | Integração Almoxarifado (picking) |
| 7 | 2 sem | Relatórios avançados e exportação |
| 8 | 2 sem | Performance e segurança |
| 9 | 2 sem | Super Admin dashboard consolidado |
|10 | 2 sem | API B2B externa (OpenAPI) |
|11 | 2 sem | Mobile‑first refinamentos |
|12 | 2 sem | Release final, documentação e suporte |

> **Próximos passos:** Revisar este roadmap com as partes interessadas, ajustar prioridades e iniciar a Sprint 0.
## 📈 Análise de Estoque Automática

**Objetivo:** Automatizar a identificação de produtos com baixo giro, próximos da validade ou críticos, fornecendo dados para decisões de promoção e gerenciamento de validade.

### Algoritmo (pseudocódigo)
```pseudo
para cada produto em estoque:
    giro = vendas_30dias / quantidade_atual
    se giro < LIMIAR_BAIXO:
        marcar como "baixo giro"
    se dias_para_validade < LIMIAR_VALIDADE:
        marcar como "próximo da validade"
    se demanda_prevista > quantidade_atual:
        marcar como "atenção de ruptura"
```

### Integração proposta
- **Backend:** Implementar a lógica em Node.js (ou Python) como Cloud Function `analyzeInventory`, exposta via API REST.
- **Frontend:** Criar uma página de administração em React/Vite que consuma a API e exiba uma tabela com colunas: Produto, Giro, Dias até validade, Status.
- **Configuração:** Definir limiares (`LIMIAR_BAIXO`, `LIMIAR_VALIDADE`) em `config.json` para ajuste fácil.

### Próximos passos
- Desenvolver a Cloud Function e rotas de API.
- Atualizar o design system para incluir componentes de tabela e filtros.
- Implementar relatórios exportáveis (CSV/PDF) para campanhas promocionais.
