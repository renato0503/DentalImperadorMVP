import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      uid: "uUIBiyMZyxNRN7irqO3aRdXqGqi1",
      email: "contato@odontoplus.com.br",
      nome: "Clínica OdontoPlus Ltda",
      role: "CLIENT",
      cpf_cnpj: "12.345.678/0001-90",
      telefone: "(65) 3621-1000",
      segmento: "Clínica",
      limite_credito: 25000,
      total_gasto: 18340,
      ultima_compra: new Date("2026-07-15"),
      origem: "Site",
      ticket_cluster: "medio",
      frequencia_cluster: "recorrente",
      vendedor_uid: "usr-001",
      vendedor_nome: "Carlos Vendas",
      ultimo_contato: new Date("2026-07-20"),
      propensao_compra: 78,
      churn_risk: "baixo",
      endereco: JSON.stringify({ logradouro: "Av. Historiador Rubens de Mendonça", numero: "3000", bairro: "Centro", cidade: "Cuiabá", estado: "MT", cep: "78000-000" }),
    },
    {
      uid: "NcTtOuP9o6gPXDzHvsCHlG42AIm1",
      email: "matheusvictorfernandesromeu4@gmail.com",
      nome: "Dr. Matheus Victor",
      role: "CLIENT",
      cpf_cnpj: "123.456.789-00",
      telefone: "(65) 99999-0001",
      segmento: "Consultório",
      limite_credito: 10000,
      total_gasto: 8900,
      ultima_compra: new Date("2026-07-18"),
      origem: "WhatsApp",
      ticket_cluster: "medio",
      frequencia_cluster: "recorrente",
      vendedor_uid: "usr-001",
      vendedor_nome: "Carlos Vendas",
      ultimo_contato: new Date("2026-07-19"),
      propensao_compra: 85,
      churn_risk: "baixo",
      endereco: JSON.stringify({ logradouro: "Rua Comandante Costa", numero: "500", bairro: "Centro", cidade: "Cuiabá", estado: "MT", cep: "78010-000" }),
    },
    {
      uid: "cust-003",
      email: "adm@sorisoperfeito.com.br",
      nome: "Sorriso Perfeito Odontologia",
      role: "CLIENT",
      cpf_cnpj: "98.765.432/0001-10",
      telefone: "(65) 3622-2000",
      segmento: "Clínica",
      limite_credito: 50000,
      total_gasto: 42000,
      ultima_compra: new Date("2026-07-10"),
      origem: "Indicação",
      ticket_cluster: "grande",
      frequencia_cluster: "recorrente",
      vendedor_uid: "usr-002",
      vendedor_nome: "Ana Operadora",
      ultimo_contato: new Date("2026-07-12"),
      propensao_compra: 92,
      churn_risk: "baixo",
      endereco: JSON.stringify({ logradouro: "Rua Barão de Melgaço", numero: "1500", bairro: "Centro", cidade: "Cuiabá", estado: "MT", cep: "78020-000" }),
    },
    {
      uid: "cust-004",
      email: "ana.beatriz@email.com",
      nome: "Dra. Ana Beatriz",
      role: "CLIENT",
      cpf_cnpj: "987.654.321-00",
      telefone: "(65) 99999-0002",
      segmento: "Consultório",
      limite_credito: 8000,
      total_gasto: 3200,
      ultima_compra: new Date("2026-06-20"),
      origem: "Site",
      ticket_cluster: "pequeno",
      frequencia_cluster: "sazonal",
      propensao_compra: 45,
      churn_risk: "medio",
      endereco: JSON.stringify({ logradouro: "Av. República do Líbano", numero: "1200", bairro: "Alvorada", cidade: "Cuiabá", estado: "MT", cep: "78030-000" }),
    },
    {
      uid: "cust-005",
      email: "lab.odonto@ufmt.br",
      nome: "Faculdade de Odontologia UFMT",
      role: "CLIENT",
      cpf_cnpj: "00.000.000/0001-91",
      telefone: "(65) 3615-8000",
      segmento: "Instituição",
      limite_credito: 100000,
      total_gasto: 78500,
      ultima_compra: new Date("2026-07-05"),
      origem: "Licitação",
      ticket_cluster: "grande",
      frequencia_cluster: "sazonal",
      vendedor_uid: "usr-001",
      vendedor_nome: "Carlos Vendas",
      ultimo_contato: new Date("2026-07-06"),
      propensao_compra: 95,
      churn_risk: "baixo",
      endereco: JSON.stringify({ logradouro: "Av. Fernando Corrêa", numero: "2367", bairro: "Boa Esperança", cidade: "Cuiabá", estado: "MT", cep: "78060-000" }),
    },
    {
      uid: "cust-006",
      email: "carlos.edu@email.com",
      nome: "Dr. Carlos Eduardo",
      role: "CLIENT",
      cpf_cnpj: "456.789.123-00",
      telefone: "(65) 99999-0003",
      segmento: "Consultório",
      limite_credito: 5000,
      total_gasto: 1200,
      ultima_compra: new Date("2026-05-10"),
      origem: "Indicação",
      ticket_cluster: "pequeno",
      frequencia_cluster: "inativo",
      propensao_compra: 20,
      churn_risk: "alto",
      endereco: JSON.stringify({ logradouro: "Rua 13 de Junho", numero: "800", bairro: "Centro Norte", cidade: "Cuiabá", estado: "MT", cep: "78040-000" }),
    },
    {
      uid: "cust-007",
      email: "compras@dentalmais.com.br",
      nome: "Dental Mais Distribuidora",
      role: "CLIENT",
      cpf_cnpj: "11.222.333/0001-44",
      telefone: "(65) 3623-3000",
      segmento: "Distribuidor",
      limite_credito: 150000,
      total_gasto: 112000,
      ultima_compra: new Date("2026-07-20"),
      origem: "WhatsApp",
      ticket_cluster: "grande",
      frequencia_cluster: "recorrente",
      vendedor_uid: "usr-002",
      vendedor_nome: "Ana Operadora",
      ultimo_contato: new Date("2026-07-21"),
      propensao_compra: 98,
      churn_risk: "baixo",
      endereco: JSON.stringify({ logradouro: "Av. Dom Bosco", numero: "500", bairro: "Verdão", cidade: "Cuiabá", estado: "MT", cep: "78050-000" }),
    },
    {
      uid: "cust-008",
      email: "gestor.renatorosa@gmail.com",
      nome: "Dr. Renato Rosa",
      role: "GESTOR",
      cpf_cnpj: "789.123.456-00",
      telefone: "(65) 99999-0004",
      segmento: "Consultório",
      limite_credito: 15000,
      total_gasto: 6700,
      ultima_compra: new Date("2026-07-12"),
      origem: "Site",
      ticket_cluster: "medio",
      frequencia_cluster: "recorrente",
      vendedor_uid: "usr-001",
      vendedor_nome: "Carlos Vendas",
      ultimo_contato: new Date("2026-07-14"),
      propensao_compra: 82,
      churn_risk: "baixo",
      endereco: JSON.stringify({ logradouro: "Rua Presidente Marques", numero: "200", bairro: "Centro", cidade: "Cuiabá", estado: "MT", cep: "78000-000" }),
    },
  ];

  const products = [
    { sku: "RS001", nome: "Resina Composta Z350 XT - 4g", categoria: "Restauradores", preco_tabela: 89.9, preco_promocional: 79.9, ncm: "3006.40.00" },
    { sku: "ALG01", nome: "Alginato CAVEX - Pote 500g", categoria: "Moldagem", preco_tabela: 42.5, preco_promocional: 37.9, ncm: "3824.99" },
    { sku: "ADP01", nome: "Adesivo Ambar Universal 5ml", categoria: "Adesivos", preco_tabela: 129.0, preco_promocional: 109.9, ncm: "3506.91" },
    { sku: "ANES01", nome: "Anestésico Lidocaína 2% - 1,8ml (cx 50)", categoria: "Anestésicos", preco_tabela: 189.0, preco_promocional: 169.0, ncm: "3004.90", controlado_anvisa: true },
  ];

  const notifications = [
    { tipo: "lead_nao_atribuido", mensagem: "Dra. Ana Beatriz aguarda atribuição há 2 dias", prioridade: "alta", secao: "CRM", acao_url: "/crm" },
    { tipo: "churn_alto", mensagem: "Dr. Carlos Eduardo está em risco alto de churn", prioridade: "alta", secao: "CRM", acao_url: "/crm/cliente/6" },
    { tipo: "proposta_sem_retorno", mensagem: "Proposta para Clínica OdontoPlus aguarda retorno há 6 dias", prioridade: "media", secao: "CRM", lido: true, acao_url: "/crm/cliente/1" },
    { tipo: "pedido_parado", mensagem: "Pedido #10484 parado na separação (2 dias)", prioridade: "alta", secao: "Operações", acao_url: "/picking" },
    { tipo: "campanha_pronta", mensagem: "Campanha 'Black Friday' está em rascunho", prioridade: "baixa", secao: "CRM", acao_url: "/campanhas" },
  ];

  const campaigns = [
    { nome: "Reativação Inativos Julho", canal: "email", publico_alvo: "Clientes com +30 dias inativos", mensagem: "Olá! Sentimos sua falta. Confira ofertas especiais para você.", status: "enviada", enviada_em: new Date("2026-07-15T10:00:00"), total_destinatarios: 45, total_convertidos: 8 },
    { nome: "SMS Promocional Agosto", canal: "sms", publico_alvo: "Todos os leads", mensagem: "Dental Imperador: condições especiais este mês!", status: "agendada", agendada_para: new Date("2026-08-01T09:00:00"), total_destinatarios: 120 },
    { nome: "Black Friday Odonto", canal: "email", publico_alvo: "Todos os clientes", mensagem: "Semana Black Friday: até 40% off em produtos selecionados!", status: "rascunho" },
  ];

  const picks = [
    { pedido_numero: "10482", sku: "RS001", produto: "Resina Composta Z350 XT - 4g", quantidade_solicitada: 10, local_estoque: "A-12" },
    { pedido_numero: "10482", sku: "ADP01", produto: "Adesivo Ambar Universal 5ml", quantidade_solicitada: 5, quantidade_separada: 3, status: "separando", local_estoque: "B-07" },
    { pedido_numero: "10483", sku: "ANES01", produto: "Anestésico Lidocaína 2% - 1,8ml (cx 50)", quantidade_solicitada: 2, quantidade_separada: 2, status: "concluido", local_estoque: "C-03" },
    { pedido_numero: "10484", sku: "RS001", produto: "Resina Composta Z350 XT - 4g", quantidade_solicitada: 20, local_estoque: "A-12" },
  ];

  const activityLogs = [
    { tipo: "pedido", descricao: "Pedido #10484 criado — Clínica OdontoPlus", tempo: new Date("2026-07-21T10:00:00") },
    { tipo: "lead", descricao: "Novo lead: Dra. Ana Beatriz (Consultório)", tempo: new Date("2026-07-21T09:30:00") },
    { tipo: "campanha", descricao: "Campanha 'Reativação Inativos' disparada para 45 clientes", tempo: new Date("2026-07-21T08:00:00") },
    { tipo: "pedido", descricao: "Pedido #10483 entregue — Consultório Dr. Matheus", tempo: new Date("2026-07-20T17:00:00") },
  ];

  for (const user of users) {
    await prisma.user.upsert({ where: { uid: user.uid }, update: user, create: user });
  }

  for (const product of products) {
    await prisma.product.upsert({ where: { sku: product.sku }, update: product, create: product });
  }

  for (const n of notifications) {
    await prisma.notification.create({ data: n });
  }

  for (const c of campaigns) {
    await prisma.campaign.create({ data: c });
  }

  for (const p of picks) {
    await prisma.pickRequest.create({ data: p });
  }

  for (const a of activityLogs) {
    await prisma.activityLog.create({ data: a });
  }

  const rs001 = await prisma.product.findUnique({ where: { sku: "RS001" } });
  const adp01 = await prisma.product.findUnique({ where: { sku: "ADP01" } });
  const alg01 = await prisma.product.findUnique({ where: { sku: "ALG01" } });
  const anes01 = await prisma.product.findUnique({ where: { sku: "ANES01" } });

  if (rs001 && adp01 && alg01 && anes01) {
    await prisma.order.upsert({
      where: { numero: "10482" },
      update: {},
      create: {
        numero: "10482", cliente_uid: "uUIBiyMZyxNRN7irqO3aRdXqGqi1", status: "Separado", valor_total: 1544,
        endereco_entrega: "Av. Historiador Rubens de Mendonça, 3000 - Cuiabá-MT", criado_em: new Date("2026-07-15T10:30:00"),
        items: { create: [
          { product_id: rs001.id, quantidade: 10, preco_unit: 89.9 },
          { product_id: adp01.id, quantidade: 5, preco_unit: 129.0 },
        ]},
      },
    });

    await prisma.order.upsert({
      where: { numero: "10483" },
      update: {},
      create: {
        numero: "10483", cliente_uid: "NcTtOuP9o6gPXDzHvsCHlG42AIm1", status: "Entregue", valor_total: 505.5,
        endereco_entrega: "Rua Comandante Costa, 500 - Cuiabá-MT", criado_em: new Date("2026-07-10T08:15:00"),
        items: { create: [
          { product_id: alg01.id, quantidade: 3, preco_unit: 42.5 },
          { product_id: anes01.id, quantidade: 2, preco_unit: 189.0 },
        ]},
      },
    });

    await prisma.order.upsert({
      where: { numero: "10484" },
      update: {},
      create: {
        numero: "10484", cliente_uid: "uUIBiyMZyxNRN7irqO3aRdXqGqi1", status: "Aguardando", valor_total: 1798,
        endereco_entrega: "Rua Barão de Melgaço, 1500 - Cuiabá-MT", criado_em: new Date("2026-07-20T09:00:00"),
        items: { create: [
          { product_id: rs001.id, quantidade: 20, preco_unit: 89.9 },
        ]},
      },
    });
  }

  console.log("Seed concluído — todos os modelos populados");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
