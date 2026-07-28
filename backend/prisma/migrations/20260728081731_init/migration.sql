-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "permissions" TEXT NOT NULL DEFAULT '[]',
    "teamId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'lead',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "cpf_cnpj" TEXT,
    "telefone" TEXT,
    "segmento" TEXT,
    "limite_credito" DOUBLE PRECISION,
    "total_gasto" DOUBLE PRECISION,
    "ultima_compra" TIMESTAMP(3),
    "origem" TEXT DEFAULT 'Manual',
    "ticket_cluster" TEXT,
    "frequencia_cluster" TEXT,
    "vendedor_uid" TEXT,
    "vendedor_nome" TEXT,
    "propensao_compra" DOUBLE PRECISION,
    "ultimo_contato" TIMESTAMP(3),
    "proximo_contato" TIMESTAMP(3),
    "nota_interna" TEXT,
    "churn_risk" TEXT,
    "endereco" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT,
    "subcategoria" TEXT,
    "marca" TEXT,
    "descricao_html" TEXT,
    "imagem_url" TEXT,
    "preco_tabela" DOUBLE PRECISION,
    "preco_promocional" DOUBLE PRECISION,
    "ncm" TEXT,
    "unidade" TEXT,
    "controlado_anvisa" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "cliente_uid" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Aguardando',
    "valor_total" DOUBLE PRECISION,
    "endereco_entrega" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_unit" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL DEFAULT 'media',
    "secao" TEXT NOT NULL,
    "lido" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acao_url" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickRequest" (
    "id" TEXT NOT NULL,
    "pedido_numero" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "produto" TEXT NOT NULL,
    "quantidade_solicitada" INTEGER NOT NULL,
    "quantidade_separada" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "local_estoque" TEXT NOT NULL DEFAULT 'Geral',
    "observacao" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PickRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickEvent" (
    "id" TEXT NOT NULL,
    "pickId" TEXT NOT NULL,
    "pedidoNumero" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dados" TEXT,

    CONSTRAINT "PickEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "publico_alvo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "agendada_para" TIMESTAMP(3),
    "enviada_em" TIMESTAMP(3),
    "total_destinatarios" INTEGER NOT NULL DEFAULT 0,
    "total_convertidos" INTEGER NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL,
    "cliente_uid" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responsavel" TEXT NOT NULL,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesAlert" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "cliente_nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL DEFAULT 'media',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SalesAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estimate" (
    "id" TEXT NOT NULL,
    "cliente_uid" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "valor_total" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Estimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tempo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "result" TEXT,
    "error" TEXT,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockBatch" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "filial" INTEGER NOT NULL DEFAULT 0,
    "lote" TEXT NOT NULL DEFAULT '',
    "validade" TIMESTAMP(3),
    "quantidade" INTEGER NOT NULL,
    "reservado" INTEGER NOT NULL DEFAULT 0,
    "disponivel" INTEGER NOT NULL,
    "giro_30d" DOUBLE PRECISION,
    "lead_time_reposicao" INTEGER,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockBatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "ProductImage_sku_idx" ON "ProductImage"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_sku_order_key" ON "ProductImage"("sku", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Order_numero_key" ON "Order"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "StockBatch_sku_key" ON "StockBatch"("sku");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Product"("sku") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cliente_uid_fkey" FOREIGN KEY ("cliente_uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_cliente_uid_fkey" FOREIGN KEY ("cliente_uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estimate" ADD CONSTRAINT "Estimate_cliente_uid_fkey" FOREIGN KEY ("cliente_uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockBatch" ADD CONSTRAINT "StockBatch_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Product"("sku") ON DELETE RESTRICT ON UPDATE CASCADE;

