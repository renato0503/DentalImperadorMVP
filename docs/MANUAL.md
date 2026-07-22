# Manual do Usuário — Dental Imperador

## Sumário

1. [Introdução](#1-introdução)
2. [Acesso à Plataforma](#2-acesso-à-plataforma)
3. [Páginas e Funcionalidades](#3-páginas-e-funcionalidades)
4. [Chatbot](#4-chatbot)
5. [Orçamento](#5-orçamento)
6. [Status de Pedido](#6-status-de-pedido)
7. [CRM / Kanban](#7-crm--kanban)
8. [Dashboard](#8-dashboard)
9. [Relatórios](#9-relatórios)
10. [Churn e Campanhas](#10-churn-e-campanhas)
11. [Picking](#11-picking)
12. [Painel Admin](#12-painel-admin)
13. [Perguntas Frequentes](#13-perguntas-frequentes)

---

## 1. Introdução

A Dental Imperador é uma plataforma B2B de atendimento odontológico, representante Gnatus em Cuiabá-MT. A plataforma oferece:

- **Chatbot inteligente** com triagem automática
- **Orçamentos** com catálogo de produtos em tempo real
- **Status de pedidos** com timeline visual
- **CRM** com Kanban de leads
- **Dashboard** com métricas e indicadores
- **Relatórios** exportáveis
- **Módulo de Retenção** com campanhas de churn
- **Picking** para separação de pedidos
- **Painel Administrativo** para gestão completa

---

## 2. Acesso à Plataforma

### 2.1 URL
- **Produção:** https://dentalimperador.web.app
- **Protótipo estático:** https://renato0503.github.io/DentalImperadorMVP/

### 2.2 Login
1. Clique em "Entrar" no canto superior direito
2. Informe email e senha cadastrados (Firebase Authentication)
3. Após login, a sidebar exibe todas as funcionalidades liberadas

### 2.3 Instalação (PWA)
No celular:
1. Acesse https://dentalimperador.web.app pelo Chrome/Safari
2. Um banner "Instale o Dental Imperador" aparecerá
3. Toque em "Instalar" e pronto — vira um app nativo

---

## 3. Páginas e Funcionalidades

| Página | Descrição | Quem Acessa |
|---|---|---|
| Início (`/`) | Landing page institucional | Todos |
| Chatbot (`/chatbot`) | Chat com IA + triagem | Todos |
| Orçamento (`/orcamento`) | Catálogo + carrinho | Todos |
| Pedido (`/pedido`) | Status de pedidos | Todos |
| Dashboard (`/dashboard`) | Métricas e gráficos | Admin, Manager, Operator |
| CRM (`/crm`) | Kanban de leads | Admin, Manager, Operator |
| Churn (`/churn`) | Risco de clientes | Admin, Manager |
| Campanhas (`/campanhas`) | Gestão de campanhas | Admin, Manager |
| Picking (`/picking`) | Separação de pedidos | Admin, Manager, Operator |
| Relatórios (`/relatorios`) | Exportação de dados | Admin, Manager, Operator |
| Admin (`/admin`) | Painel consolidado | Apenas Admin |

---

## 4. Chatbot

1. Acesse a página Chatbot
2. Preencha a triagem automática (4 passos: nome, email, telefone, tipo)
3. Inicie a conversa com o assistente virtual
4. Pergunte sobre produtos, orçamentos ou status de pedido

*O chat persiste no Firestore — seu histórico fica salvo entre sessões.*

---

## 5. Orçamento

1. Acesse Orçamento
2. Filtre produtos por categoria (Restauradores, Moldagem, etc.)
3. Clique em "Adicionar" nos produtos desejados
4. Ajuste quantidades no carrinho lateral
5. Clique em "Gerar Proposta"
6. Visualize a proposta, imprima ou feche

---

## 6. Status de Pedido

1. Acesse Status de Pedido
2. Digite o número do pedido (ex: 10482)
3. A timeline mostra o andamento: Aguardando → Confirmado → Separado → Saiu para entrega → Entregue
4. A tabela de itens exibe produtos, quantidades e valores

---

## 7. CRM / Kanban

1. Acesse CRM
2. Visualize leads organizados em 5 colunas: Leads → Contato Inicial → Proposta → Negociação → Clientes
3. Arraste e solte cards entre as colunas para atualizar o status
4. Use os filtros de segmento e origem para refinar a visualização

---

## 8. Dashboard

- Métricas: Faturamento, Pedidos, Leads, Ticket Médio
- Gráfico de barras: vendas por mês
- Gráfico doughnut: segmento de clientes

---

## 9. Relatórios

1. Acesse Relatórios
2. Navegue pelas abas: Resumo, Vendas, Categorias, Top Produtos
3. Use os filtros de período (mês inicial/final)
4. Exporte CSV: selecione o tipo no dropdown "Exportar CSV"
5. Imprima: use o botão "Imprimir" ou Ctrl+P

---

## 10. Churn e Campanhas

### Churn
- **Dashboard de Churn:** taxa de churn, clientes em risco, distribuição por score
- **Tabela:** lista de clientes com score alto/médio, dias inativos

### Campanhas
1. Acesse Campanhas
2. Clique em "Nova Campanha"
3. Preencha: nome, canal (email/SMS), público-alvo, mensagem
4. Opcional: agende para uma data futura
5. Crie a campanha — ela ficará como "Rascunho"
6. Quando estiver pronta, clique em "Disparar Agora"

---

## 11. Picking

1. Acesse Picking
2. Visualize as separações em cards com barra de progresso
3. Filtre por status (Pendente, Separando, Concluído)
4. Clique em "Concluir Separação" para finalizar um pick
5. Use "Nova Separação" para criar picks manualmente
6. O feed de eventos no rodapé mostra o histórico em tempo real

---

## 12. Painel Admin

*Acessível apenas para administradores.*

- **KPIs:** Faturamento, Pedidos, Clientes Ativos, Ticket Médio, Leads, Churn
- **Gráficos:** Vendas mensais, Distribuição de clientes, Tendência de churn
- **SLA:** Taxa de entrega no prazo, tempo médio de resposta do chat
- **Atividades:** Feed com últimas ações do sistema
- **Usuários:** Gerencie papéis (admin, manager, operator, cliente)

---

## 13. Perguntas Frequentes

**Como recuperar minha senha?**
Atualmente o reset de senha não está implementado. Solicite ao administrador.

**Onde vejo meus pedidos anteriores?**
Na página Status de Pedido, informe o número do pedido. O histórico completo estará disponível em versões futuras.

**Como criar um lead no CRM?**
Por enquanto, os leads são cadastrados manualmente via API. A inserção direta pelo Kanban estará disponível na próxima versão.

**O chatbot responde em tempo real?**
Sim, o chat usa Firestore `onSnapshot` para mensagens em tempo real. A IA (Groq) pode levar alguns segundos para processar.

**Preciso de internet para usar?**
Sim. O app é PWA e faz cache de assets, mas os dados são carregados da API/Firestore. O chat exibe um banner offline se a conexão cair.

**Como entro em contato com o suporte?**
WhatsApp: (65) 3615-0100 | Email: vendas@dentalimperador.com.br
