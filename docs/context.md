## Visão Geral do Produto

A **Dental Imperador** está sendo desenvolvida como uma plataforma B2B totalmente integrada, projetada para melhorar o atendimento ao cliente, otimizar processos internos e reduzir churn. O MVP consiste em um **Chatbot de Atendimento**, evoluindo para um **CRM completo**, um **Módulo de Retenção (Churn)**, integrações logísticas avançadas e um **Painel Administrativo (Super Admin)**. Toda a solução será desenvolvida como **PWA (Progressive Web App)**, garantindo experiência nativa em desktop, iOS e Android.

---

## Sobre a Empresa — Dental Imperador

Dados reais da operação (usados para popular o MVP com conteúdo ilustrativo):

- **Marca:** Dental Imperador
- **Representante:** Gnatus (desenvolve, fábrica e comercializa equipamentos odontológicos e médicos)
- **Público-alvo:** estudantes de Odontologia e toda a área da saúde — "a loja mais completa para montar seu kit acadêmico"
- **E-mail comercial:** vendas@dentalimperador.com.br
- **Telefone:** (65) 3615-0199
- **WhatsApp:** (65) 3615-0100
- **Endereço:** Av. Manoel José de Arruda, 2285 — Grande Terceiro, Cuiabá - MT, 78065-700

### Missão
Proporcionar satisfação e credibilidade nos serviços prestados pela Empresa disponibilizando produtos de qualidade, sempre prezando bom atendimento com ética e comprometimento, agregando valores aos clientes e colaboradores, envolvendo todos na mesma sintonia da responsabilidade socioambiental.

### Visão
Busca constante da excelência em servir, se tornando referência positiva com os clientes, com os fornecedores e com os colaboradores, tendo como base a ética e o comprometimento.

### Valores
Honestidade · Valorização · Capacitação · Ações Transparentes e éticas · Responsabilidade social.

### Linhas de Produto (catálogo)
Acadêmicos · Acessórios para periféricos · Anestésicos · Angiologia · Aparelho de pressão · Aparelhos médicos · Biossegurança · Cerâmicas · Cimentos · Cirurgia e periodontia · Consultório odontológico · Curativos e pomadas · Dentística e estética · Descartáveis · Eletroterapia · Endodontia · Equipamentos · Equipamentos médicos · Equipamentos para laboratório de prótese · Esportes · Estética · Fisioterapia · Fitness, funcional e musculação · Ginecologia & obstetrícia · Harmonização orofacial · Higiene oral · Home Care · Implantodontia · Instrumentais · Instrumentais para prótese · Instrumentos para podologia · Materiais para radiologia · Material de consumo · Mobilidade · Moldagem e modelo · Odontopediatria · Ortodontia · Oxigenoterapia · Para o consultório · Parasitologia · Peças de mão · Podologia · Pontas e brocas · Prevenção e profilaxia · Produtos ortopédicos · Proteção profissional & EPI · Prótese clínica · Prótese laboratorial · Reabilitação oral · Resgate e salvamento · Soluções digitais.

---

## MVP Estático (Protótipo) — 2026-07-14

Foi construído um **protótipo funcional estático** (HTML/CSS/JS puro, sem backend, dados mockados) cobrindo as telas dos Sprints 1-4, publicado no GitHub Pages a partir da raiz do repositório.

- **Telas:** `index.html` (Landing), `chatbot.html`, `orcamento.html`, `pedido.html`, `dashboard.html`, `crm.html`.
- **Design:** segue o Media Kit (Verde Imperador `#00A650`, Vermelho Dental `#E31E24`, Montserrat + Inter).
- **Dados reais aplicados no protótipo:** contatos, endereço, Missão/Visão/Valores e as 51 categorias de produto deste arquivo foram usados no site (header, seção "Sobre" e footer).
- **Crédito:** MVP criado pela **Cerrado Tech** para fins comerciais e ilustrativos.
- **Deploy:** workflow `.github/workflows/deploy.yml` publica a raiz (`publish_dir: ./`) na branch `gh-pages`.
- **Pendência:** login Firebase Auth ainda não implementado; dados são mockados.

## Sprint 1 — Fundamentos do MVP (Concluído em 2026-07-21)

A Sprint 1 foi executada com a arquitetura final definida:

### Stack Implementada

| Componente | Tecnologia | Status |
|---|---|---|
| **Frontend** | React 18 + TypeScript + Vite (PWA) | Scaffold completo |
| **Backend Core** | NestJS + Prisma + PostgreSQL | Scaffold completo, mock de produtos |
| **Firebase Auth** | Produção | Ativo |
| **Firebase Firestore** | Produção | Coleções `users`, `conversations`, `messages` |
| **Firebase Hosting** | Produção | Domínio: `dentalimperador.web.app` |
| **Cloud Function** | callGroq (2nd Gen) | Criada, aguardando GROQ_API_KEY |
| **Cache** | Redis (planejado) | Pendente |

### Estrutura do Monorepo

```
/
├── frontend/          # React 18 + TypeScript + Vite (PWA)
│   ├── src/
│   │   ├── lib/       # Firebase, Auth
│   │   ├── components/
│   │   │   ├── layout/  # Header, Sidebar, AppShell
│   │   │   └── chat/    # MessageList, InputBox, ChatWidget
│   │   └── pages/     # Home, Chatbot, Dashboard, Orcamento, Pedido, CRM, Login
│   └── vite.config.ts  # PWA config (Workbox)
├── backend/           # NestJS + Prisma
│   ├── prisma/schema.prisma  # User, Product, Order, OrderItem
│   └── src/products/  # CRUD mock de produtos (/api/v1/products)
├── firebase/
│   ├── firestore.rules      # Regras restritivas por role
│   ├── firestore.indexes.json
│   ├── storage.rules
│   └── functions/src/index.ts  # callGroq (Cloud Function 2nd Gen)
├── scripts/           # Seed admin users
├── docs/              # Documentação do projeto
└── .github/workflows/ # CI/CD (GH Pages + Firebase Hosting)
```

### Firebase Project

| Propriedade | Valor |
|---|---|
| Project ID | `dentalimperador-d2529` |
| Domínio produção | `dentalimperador.web.app` |
| Authentication | ✅ Produção |
| Data Connect (PostgreSQL) | ✅ Produção |
| Firestore | ✅ Produção |
| Storage | ✅ Produção |
| Hosting | ✅ Produção |

### Usuários Admin (Firestore)

| UID | Email | Papel |
|---|---|---|
| `NcTtOuP9o6gPXDzHvsCHlG42AIm1` | matheusvictorfernandesromeu4@gmail.com | admin |
| `uUIBiyMZyxNRN7irqO3aRdXqGqi1` | gestor.renatorosa@gmail.com | admin |

### Chatbot

- Componentes de chat criados (MessageList, InputBox, ChatWidget)
- Integração com Firestore via `onSnapshot` (tempo real)
- Chamada à Cloud Function `callGroq` para respostas da IA
- Persistência de mensagens na subcoleção `messages`

### Próximos Passos Imediatos

1. Configurar variável `GROQ_API_KEY` no Firebase (Cloud Function)
2. Configurar `DATABASE_URL` no backend (PostgreSQL via Data Connect)
3. Finalizar CI/CD (Firebase Hosting)
4. Iniciar Sprint 2 (chatbot avançado, orçamento real, status de pedido)

---

## Jornada do Usuário e Chatbot

| Etapa | Descrição | Fluxo do Bot | Resultado |
|---|---|---|---|
| **Abertura** | Cliente acessa a página de suporte via web ou app | Saudação personalizada + opções de auto‑atendimento | Início da conversa |
| **Triagem** | Bot coleta informações (nome, CPF/CNPJ, tipo de solicitação) | Perguntas guiadas + validação de dados | Dados estruturados prontos para consulta |
| **Orçamento** | Cliente solicita orçamento | Bot consulta catálogo em tempo real e gera proposta automática | Proposta entregue instantaneamente |
| **Status de Pedido** | Cliente pergunta por status | Bot consulta API de pedidos e responde com status (Faturado, Entregue, Separado, Saiu para entrega) | Visão clara do ciclo de entrega |
| **Sugestão de Produto** | Produto não está em estoque | Algoritmo de similaridade busca itens substitutos *baseado em categoria, preço e histórico de compra* | Bot propõe alternativas relevantes |
| **Encerramento** | Cliente confirma ou finaliza a conversa | Bot registra histórico e avança o lead ao CRM | Dados persistidos para follow‑up |

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

| Integração | Tipo | Tecnologia | Observações |
|---|---|---|---|
| **Almoxarifado** | Bidirecional, evento‑driven | **Google Cloud Pub/Sub** + API REST (JSON) | Mensagens de `picking` disparadas pelo bot → backend → sistema de estoque |
| **ERP FlexTotal** | REST | **NestJS (FlexTotalAdapter)** + Redis cache | Endpoints D14/D15/D16 mapeados |
| **Gateway de pagamento** | Webhook | **Stripe**, **PagSeguro SDK** | Atualização de status de pagamento em tempo real |
| **Email/SMS** | REST | **SendGrid**, **Twilio** | Templates de retenção configuráveis |
| **Banco de Dados** | Relacional + NoSQL | **PostgreSQL** (Data Connect) + **Firestore** (chat) | Dados transacionais no SQL; histórico de eventos e chats no NoSQL |
| **Auth / IAM** | Firebase Auth | **Firebase Authentication** | Login por email/senha + Google OAuth |
| **AI** | REST + Cloud Function | **Groq API** (llama-3.3-70b-versatile) via 2nd Gen | Orçamentos, sugestões e status |

**API padrão**: RESTful JSON com versionamento (`/api/v1/…`), uso de **OpenAPI 3.0** para contrato.

---

## Requisitos de UI/UX e Arquitetura (PWA)

- **Arquitetura**: Monorepo com workspaces (frontend + backend + functions).
- **PWA**: Service Workers (Workbox) para cache offline, manifest com ícone, install prompt.
- **Design System**: Tokens de cores (Verde Imperador `#00A650`, Vermelho Dental `#E31E24`), tipografia **Inter** + **Montserrat**.
- **Responsividade**: Layout flexível com sidebar fixa em desktop, oculta em mobile.
- **Acessibilidade**: ARIA labels, roles, `aria-live` no chat.
- **Performance**: Lazy loading de rotas, PWA com runtime caching do Firestore.
- **Testes UI**: **Jest** (unit) + **Cypress** (e2e) — planejado.

---

## Próximos Passos / Roadmap

1. **Sprint 2** — Chatbot avançado e primeira integração CRM
   - Triagem automática (forms dinâmicos)
   - Tela de orçamento (consulta API NestJS)
   - Tela de status de pedido (`/api/v1/orders/:id`)
   - Modelar tabelas `orders` e `order_items` no PostgreSQL
   - Refinar prompts Groq
   - Configurar GROQ_API_KEY no Firebase

2. **Sprint 3** — CRM Core (Kanban, tabelas, dashboards)
3. **Sprint 4** — Polimento MVP, SEO, monitoramento
4. **Sprints 5-12** — Churn, Picking, Relatórios, Super Admin, API B2B

> **Próximo passo imediato:** Configurar variáveis de ambiente (GROQ_API_KEY, DATABASE_URL) e realizar o primeiro deploy do frontend React no Firebase Hosting.
