# Especificação de Dados — Integração com o ERP da Dental Imperador

> **Propósito:** Este documento define **quais dados precisamos consumir (e, em alguns casos, enviar) do ERP atual da Dental Imperador** para alimentar a plataforma B2B (Chatbot, Orçamento, Status de Pedido, CRM, Dashboard, Churn e Super Admin).
>
> **Audiência:** Equipe Cerrado Tech (integradores) e fornecedores/consultores responsáveis pelo ERP interno da Dental Imperador.
>
> **Status:** Rascunho para levantamento com o time do ERP. Atualizado em 2026-07-16.

---

## 1. Contexto e objetivo

A plataforma Dental Imperador (PWA) não será a fonte primária de verdade dos dados operacionais — o **ERP interno da Dental** é. Portanto, o ERP deve expor (via REST ou SOAP) os dados listados abaixo. A camada de integração da plataforma (backend NestJS) fará o **mapeamento de campos** (adapter pattern) e, quando necessário, cache (Redis) para catálogos de alto acesso.

Conforme `context.md`, a integração ERP é **SOAP ou REST (dependendo do fornecedor)**, usando Apache CXF (SOAP) ou Axios (REST), com foco em **campos críticos: pedido, NF e entrega**.

A API padrão da plataforma é **RESTful JSON versionada** (`/api/v1/...`) e documentada via **OpenAPI 3.0**.

---

## 2. Topologia de integração

```
[ERP Dental Imperador]  ──(SOAP/REST)──>  [Backend NestJS: adapters + cache]
                                                │
        ┌───────────────┬───────────────┬───────┼───────────────┬───────────────┐
        ▼               ▼               ▼       ▼               ▼               ▼
   Chatbot         Orçamento        Status   CRM/Kanban     Dashboard      Churn/SuperAdmin
   (Groq)          (catálogo)       Pedido   (clientes)      (métricas)    (risco)
```

**Fluxos suportados:**
- **Pull (leitura):** catálogo, estoque, preços, pedidos, NF, status de entrega, clientes, financeiro.
- **Push (escrita):** criação de pedido/orçamento originado no portal, eventos de `picking` para o almoxarifado (via Kafka/RabbitMQ), atualização de cadastro do cliente.

---

## 3. Entidades e dados necessários do ERP

### 3.1. Produtos / Catálogo (`products`)
Alimenta: Orçamento Automático, Chatbot (sugestão de substitutos), Carrinho, Catálogo do Portal B2B.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `sku` | string | ✅ | Código único do produto (ex.: `RES-500`) |
| `nome` | string | ✅ | Descrição comercial |
| `descricao` | string | ⚪ | Descrição técnica / benefícios |
| `categoria` | string | ✅ | Uma das 51 linhas de produto (ex.: `Implantes`) |
| `subcategoria` | string | ⚪ | Para filtros finos |
| `marca` | string | ⚪ | Ex.: Gnatus |
| `preco_tabela` | decimal | ✅ | Preço de tabela (BRL) |
| `preco_promocional` | decimal | ⚪ | Se houver |
| `unidade` | string | ✅ | `un`, `cx`, `g`, `L`... |
| `ncm` | string | ⚪ | Para NF-e |
| `controlado_anvisa` | boolean | ✅ | true se exigir receita (anestésicos, etc.) |
| `ativo` | boolean | ✅ | Disponível para venda |
| `imagens` | array<string> | ⚪ | URLs de imagem |
| `atributos` | object | ⚪ | Espec. técnica livre |

### 3.2. Estoque (`inventory`)
Alimenta: Orçamento (disponibilidade), Almoxarifado (picking), Dashboard (taxa de preenchimento), Análise de giro.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `sku` | string | ✅ | FK para produto |
| `quantidade` | integer | ✅ | Saldo atual |
| `reservado` | integer | ⚪ | Em pedidos não faturados |
| `disponivel` | integer | ✅ | `quantidade - reservado` |
| `local` | string | ⚪ | Depósito (Cuiabá, etc.) |
| `validade_lote` | date | ⚪ | Para alerta de validade |
| `giro_30d` | decimal | ⚪ | Vendas últimos 30 dias (p/ análise de estoque) |
| `lead_time_reposicao` | integer | ⚪ | Dias para repor |

### 3.3. Clientes (`customers`)
Alimenta: CRM, Chatbot (triagem/CPF-CNPJ), Churn, Faturamento, Programa de Fidelidade.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id_cliente` | string | ✅ | ID no ERP |
| `tipo` | enum | ✅ | `PF` / `PJ` |
| `cpf_cnpj` | string | ✅ | Documento (usado na triagem do bot) |
| `nome_razao_social` | string | ✅ | |
| `nome_fantasia` | string | ⚪ | |
| `inscricao_estadual` | string | ⚪ | |
| `email` | string | ✅ | |
| `telefone` | string | ⚪ | |
| `whatsapp` | string | ⚪ | Para notificações Twilio |
| `endereco` | object | ✅ | logradouro, nº, bairro, cidade, UF, CEP |
| `segmento` | string | ⚪ | estudante, clínica, revenda... |
| `limite_credito` | decimal | ⚪ | |
| `data_cadastro` | date | ✅ | Para cálculo de churn |
| `ultima_compra` | date | ✅ | **Crítico para Churn** (regra: 60 dias) |
| `pontos_fidelidade` | integer | ⚪ | Programa de fidelidade |

### 3.4. Pedidos (`orders`)
Alimenta: Status de Pedido, Chatbot (consulta), CRM, Dashboard, Super Admin (tracking).

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `numero_pedido` | string | ✅ | Ex.: `10482` (usado no chatbot/pedido.html) |
| `id_cliente` | string | ✅ | FK |
| `data_emissao` | datetime | ✅ | |
| `status` | enum | ✅ | `Faturado`, `Separado`, `Enviado`, `Entregue`, `Cancelado` |
| `itens` | array | ✅ | ver 3.4.1 |
| `valor_total` | decimal | ✅ | |
| `condicao_pagamento` | string | ⚪ | PIX, boleto, cartão... |
| `canal_origem` | string | ⚪ | portal, whatsapp, balcão |
| `protocolo` | string | ⚪ | protocolo do orçamento (#ORÇ-xxxx) |

**3.4.1 Item de pedido (`orders.itens[]`)**
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `sku` | string | ✅ |
| `nome` | string | ✅ |
| `quantidade` | integer | ✅ |
| `preco_unitario` | decimal | ✅ |
| `desconto` | decimal | ⚪ |

### 3.5. Nota Fiscal / Faturamento (`invoices`)
Alimenta: Portal B2B (download XML/PDF/DACTE), Financeiro do CRM, Churn (inadimplência).

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `chave_nfe` | string | ✅ | Chave NF-e (44 dígitos) |
| `numero_pedido` | string | ✅ | FK pedido |
| `serie` | string | ⚪ | |
| `data_emissao` | datetime | ✅ | |
| `valor` | decimal | ✅ | |
| `status` | enum | ✅ | emitida, cancelada, inutilizada |
| `xml_url` | string | ✅ | Para download |
| `pdf_url` | string | ✅ | DANFE |
| `protocolo_autorizacao` | string | ⚪ | |

### 3.6. Entrega / Rastreamento (`shipments`)
Alimenta: Status de Pedido (linha do tempo), Super Admin (SLA de entrega), notificações.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `numero_pedido` | string | ✅ | FK |
| `transportadora` | string | ⚪ | |
| `codigo_rastreio` | string | ✅ | Enviado por WhatsApp/e-mail |
| `data_saida` | datetime | ⚪ | "Saiu para entrega" |
| `data_entrega` | datetime | ⚪ | "Entregue" |
| `status_entrega` | enum | ✅ | coletado, em_transito, entregue, falha |
| `link_rastreio` | string | ⚪ | URL da transportadora |
| `assinarado_por` | string | ⚪ | |

### 3.7. Financeiro (`financial`)
Alimenta: CRM (gestão de crédito), Churn (inadimplência >30d), Dashboard (ticket médio, receita).

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id_cliente` | string | ✅ | FK |
| `documento` | string | ⚪ | Boleto/NFe |
| `vencimento` | date | ✅ | |
| `valor` | decimal | ✅ | |
| `status` | enum | ✅ | aberto, pago, atrasado, cancelado |
| `data_pagamento` | date | ⚪ | |
| `forma_pagamento` | string | ⚪ | |

### 3.8. Preços e Condições Comerciais (`pricing`)
Alimenta: Orçamento (descontos progressivos), Portal B2B, Contrato B2B.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id_cliente` / `segmento` | string | ⚪ | Tabela por cliente ou segmento |
| `faixa_volume` | string | ⚪ | ex.: `R$ 15.001–30.000` |
| `desconto_adicional` | decimal | ⚪ | % progressivo por volume |
| `desconto_avista` | decimal | ⚪ | PIX/boleto (5-8%) |
| `pedido_minimo` | decimal | ✅ | R$ 200,00 (padrão) |
| `frete_gratis_acima` | decimal | ⚪ | por região |

---

## 4. Eventos / Webhooks esperados do ERP

Além do pull, o ERP (ou o backend) deve publicar eventos para manter a plataforma em tempo real:

| Evento | Gatilho | Consumidor |
|--------|---------|------------|
| `order.created` | Pedido criado no ERP | Chatbot/CRM |
| `order.status_changed` | Mudança de status (Faturado→Separado→...) | Status de Pedido, notificações |
| `invoice.issued` | NF-e autorizada | Portal B2B, Financeiro |
| `stock.low` | Estoque abaixo do mínimo | Dashboard, Almoxarifado |
| `picking.started` / `picking.completed` | Separação (via Kafka/RabbitMQ) | Status de Pedido, Almoxarifado |

**Push da plataforma → ERP:** endpoint `/api/v1/warehouse/pick` (payload `sku`, `quantidade`) para disparar `picking` no almoxarifado.

---

## 5. Mapping de campos críticos (resumo)

Conforme `context.md`, os campos críticos de mapeamento são **pedido, NF e entrega**:

| Conceito de negócio | Entidade ERP | Campo sugerido |
|---------------------|--------------|----------------|
| Identificação do pedido | `orders` | `numero_pedido` |
| Situação do pedido | `orders` | `status` (enum padronizado) |
| Documento fiscal | `invoices` | `chave_nfe` |
| Rastreio | `shipments` | `codigo_rastreio` |
| Cliente (triagem bot) | `customers` | `cpf_cnpj` |
| Produto (orçamento) | `products` | `sku` + `preco_tabela` |
| Disponibilidade | `inventory` | `disponivel` |

---

## 6. Requisitos de contrato de API com o fornecedor do ERP

Para solicitar aos provedores do ERP da Dental, exigir:

1. **Formato:** REST JSON (`/api/v1/...`) preferencial; ou WSDL SOAP documentado.
2. **Autenticação:** API Key + JWT (Bearer), com refresh token (Axios interceptor).
3. **Rate limit:** documentado (referência contrato B2B: 60 req/min na API pública).
4. **Paginação:** `page`/`pageSize` ou cursor para catálogo e pedidos.
5. **Filtros:** por data, cliente, status, SKU, categoria.
6. **OpenAPI 3.0:** contrato formal para geração de SDK.
7. **Webhooks:** endpoints de callback configuráveis (URL da plataforma).
8. **Ambientes:** homologação (staging) e produção.
9. **SLA / disponibilidade:** contrato de uptime e janela de manutenção.
10. **Mapeamento de categoria:** garantir que as **51 categorias** do portfólio estejam representadas no campo `categoria`.
11. **Tratamento de erro:** códigos HTTP padrão + mensagem estruturada (`code`, `message`, `details`).
12. **Encoding:** UTF-8; datas em ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`).

---

## 7. Perguntas abertas para o time do ERP

- [ ] O ERP expõe REST ou apenas SOAP? Qual versão do WSDL?
- [ ] Quais campos de `products` e `inventory` estão disponíveis hoje?
- [ ] O ERP emite eventos/webhooks nativamente ou precisamos de polling?
- [ ] Existe ambiente de homologação acessível pela Cerrado Tech?
- [ ] A tabela de preços por cliente/segmento está no ERP ou em planilha à parte?
- [ ] Como o almoxarifado confirma a separação de volta ao ERP (para o fluxo `picking`)?
- [ ] Há limite de requisições por dia/hora na API do ERP?

---

## 8. Referências internas

- `context.md` — Requisitos de Integração (ERP: SOAP/REST, campos críticos pedido/NF/entrega).
- `implementation.md` — Sprints 1-12 (modelagem de coleções, Cloud Functions, Kafka para picking).
- `contrato_acordo_comercial_dental_imperador.md` — Cláusula 3.3 (API B2B OpenAPI 3.0, webhooks, rate limit 60 req/min), Cláusula 4.3 (regra de churn 60 dias), Cláusula 2 (condições comerciais/descontos).
