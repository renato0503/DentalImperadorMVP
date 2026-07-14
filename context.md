## Visão Geral do Produto

A **Dental Imperador** será lançada com uma plataforma B2B totalmente integrada, projetada para melhorar o atendimento ao cliente, otimizar processos internos e reduzir churn. O MVP consiste em um **Chatbot de Atendimento**, evoluindo para um **CRM completo**, um **Módulo de Retenção (Churn)**, integrações logísticas avançadas e um **Painel Administrativo (Super Admin)**. Toda a solução será desenvolida como **PWA (Progressive Web App)**, garantindo experiência nativa em desktop, iOS e Android.

---

## Jornada do Usuário e Chatbot

| Etapa | Descrição | Fluxo do Bot | Resultado |
|------|-----------|--------------|-----------|
| **Abertura** | Cliente acessa a página de suporte via web ou app | Saudação personalizada + opções de auto‑atendimento | Início da conversa |
| **Triagem** | Bot coleta informações (nome, CPF/CNPJ, tipo de solicitação) | Perguntas guiadas + validação de dados | Dados estruturados prontos para consulta |
| **Orçamento** | Cliente solicita orçamento | Bot consulta catálogo em tempo real e gera proposta automática | Proposta entregue instantaneamente |
| **Status de Pedido** | Cliente pergunta por status | Bot consulta API de pedidos e responde com status (Faturado, Entregue, Separado, Saiu para entrega) | Visão clara do ciclo de entrega |
| **Sugestão de Produto** | Produto não está em estoque | Algoritmo de similaridade busca itens substitutos *baseado em categoria, preço e histórico de compra* | Bot propõe alternativas relevantes |
| **Encerramento** | Cliente confirma ou finaliza a conversa | Bot registra histórico e avança o lead ao CRM | Dados persistidos para follow‑up |

*Todos os eventos são logados em um **Event Store** para auditoria e análise de métricas de jornada.*

---

## Módulos do Sistema (CRM, Churn, Admin)

### CRM e Gestão de Clientes
- **Registro completo**: histórico de interações, pedidos, pagamentos e tickets.
- **Visão Kanban**: pipelines customizáveis por segmento (prospects, leads, clientes ativos, etc.).
- **Tabelas avançadas**: filtros por data, produto, status, SLA.
- **Dashboards**: indicadores de aquisição, NPS, taxa de conversão, ticket médio.

### Módulo de Retenção (Churn)
- **Detecção de inatividade**: regras de negócio que identificam clientes sem compras nos últimos *X* dias.
- **Automação**: disparo de campanhas (e‑mail, SMS, push) com ofertas de reativação.
- **Score de risco**: modelo de machine‑learning (ex.: XGBoost) alimentado por frequência de compra, valor médio e interações de suporte.

### Painel Administrativo (Super Admin)
- **Visão holística**: métricas de todos os departamentos (vendas, suporte, logística).
- **Dashboards de performance**: SLA de entrega, taxa de preenchimento de estoque, tempo médio de resposta do bot.
- **Tracking em tempo real**: mapa de status de pedidos com atualização via WebSockets.
- **Gerenciamento de usuários e permissões**: papéis granulares (admin, gerente, operador).

---

## Requisitos de Integração e Backend

| Integração | Tipo | Tecnologias sugeridas | Observações |
|------------|------|-----------------------|-------------|
| **Almoxarifado** | Bidirecional, evento‑driven | **RabbitMQ / Kafka** + API RESTful (JSON) | Mensagens de `picking` disparadas pelo bot → backend → sistema de estoque; confirmação de separação volta ao bot. |
| **ERP interno** | SOAP / REST (dependendo do fornecedor) | **Apache CXF** (para SOAP) ou **Axios** (para REST) | Mapeamento de campos críticos (pedido, NF, entrega). |
| **Gateway de pagamento** | Webhook | **Stripe**, **PagSeguro SDK** | Atualização de status de pagamento em tempo real. |
| **Serviço de email/SMS** | REST | **SendGrid**, **Twilio** | Templates de retenção configuráveis. |
| **Banco de Dados** | Relacional + NoSQL | **PostgreSQL** (RDBMS) + **Firestore** (document store) | Dados transacionais no SQL; histórico de eventos e chats no NoSQL. |
| **Auth / IAM** | OAuth2 / OpenID Connect | **Auth0** ou **Keycloak** | SSO para equipe interna e integração SAML para clientes corporativos. |
| **Analytics** | Eventos em tempo real | **Google Analytics 4**, **Segment**, **Metriql** | Dashboard de uso e performance do bot. |

**API padrão**: **RESTful JSON** com versionamento (`/api/v1/…`), uso de **OpenAPI 3.0** para contrato e geração automática de SDKs.

---

## Requisitos de UI/UX e Arquitetura (PWA)

- **Arquitetura**: **Micro‑frontend** (ex.: **Single SPA** ou **Module Federation**) para separar módulos (Chatbot, CRM, Admin) e permitir upgrades independentes.
- **PWA**: Service Workers para cache offline, push notifications para retenção, manifest com ícone adaptativo.
- **Design System**: Tokens de cores (paleta neutra + accent **#0066CC**), tipografia **Inter**, componentes baseados em **Material‑Web** com variações dark/light.
- **Responsividade**: Grid flexível 12‑colunas, breakpoints `xs <576px`, `sm ≥576px`, `md ≥768px`, `lg ≥992px`, `xl ≥1200px`.
- **Acessibilidade**: WCAG 2.2 AA, ARIA labels nos botões de ação, contraste mínimo 4.5:1.
- **Performance**: Lazy loading de rotas, bundles < 150 KB gzipped, uso de **ESBuild**/**Vite** para fast HMR.
- **Testes UI**: **Cypress** (e2e) + **Storybook** (componentes isolados).

---

## Próximos Passos / Sugestões do Arquiteto

1. **Definir stack tecnológica**  
   - Frontend: **React 18 + TypeScript + Vite** (PWA)  
   - Backend: **Node.js (NestJS) + TypeScript** (API)  
   - Infra: **Docker + Kubernetes (EKS / AKS)**, CI/CD com **GitHub Actions**.
2. **Padronizar contratos de API**  
   - Crie um repositório **OpenAPI** centralizado.  
   - Use **Axios** com interceptors para tratamento de erros e refresh token.
3. **Orquestração de eventos**  
   - Implante **Kafka** como backbone de eventos entre bot, CRM e almoxarifado.  
   - Defina tópicos: `order.created`, `stock.low`, `picking.started`, `picking.completed`.
4. **Camada de integração com Almoxarifado**  
   - **Adapter pattern** para abstrair diferenças entre sistemas legados.  
   - Expor endpoints **/api/v1/warehouse/pick** que aceitam payloads padronizados (SKU, quantidade).
5. **Segurança**  
   - JWT com claims customizados (role, dept).  
   - **Rate limiting** nas APIs públicas do bot (ex.: 30 req/min).
6. **Observabilidade**  
   - **Prometheus + Grafana** para métricas; **Elastic APM** para tracing de chamadas entre micro‑serviços.
7. **Planejamento de releases**  
   - **MVP** (Chatbot + CRM básico) – Sprint 1‑4.  
   - **Iteração 2** (Módulo Churn + integração estoque) – Sprint 5‑8.  
   - **Iteração 3** (Super Admin + dashboards avançados) – Sprint 9‑12.
8. **Documentação**  
   - Wiki centralizada (Confluence) com diagramas **C4** (Context, Container, Component, Code).  
   - Templates de PR que exigem validação de lint, testes unitários e coverage > 80 %.

> **Próximo passo imediato:** Aprovar a stack sugerida e priorizar a criação do repositório de contratos OpenAPI. Em seguida, podemos iniciar a configuração do repositório monorepo e gerar os primeiros scaffolds de micro‑frontend.
