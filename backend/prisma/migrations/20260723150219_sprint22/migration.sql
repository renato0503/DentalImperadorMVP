-- AlterTable
ALTER TABLE "User" ADD COLUMN "churn_risk" TEXT;
ALTER TABLE "User" ADD COLUMN "endereco" TEXT;
ALTER TABLE "User" ADD COLUMN "frequencia_cluster" TEXT;
ALTER TABLE "User" ADD COLUMN "nota_interna" TEXT;
ALTER TABLE "User" ADD COLUMN "propensao_compra" REAL;
ALTER TABLE "User" ADD COLUMN "proximo_contato" DATETIME;
ALTER TABLE "User" ADD COLUMN "ticket_cluster" TEXT;
ALTER TABLE "User" ADD COLUMN "ultimo_contato" DATETIME;
ALTER TABLE "User" ADD COLUMN "vendedor_nome" TEXT;
ALTER TABLE "User" ADD COLUMN "vendedor_uid" TEXT;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL DEFAULT 'media',
    "secao" TEXT NOT NULL,
    "lido" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acao_url" TEXT
);

-- CreateTable
CREATE TABLE "PickRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pedido_numero" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "produto" TEXT NOT NULL,
    "quantidade_solicitada" INTEGER NOT NULL,
    "quantidade_separada" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "local_estoque" TEXT NOT NULL DEFAULT 'Geral',
    "observacao" TEXT,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PickEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pickId" TEXT NOT NULL,
    "pedidoNumero" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dados" TEXT
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "publico_alvo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "agendada_para" DATETIME,
    "enviada_em" DATETIME,
    "total_destinatarios" INTEGER NOT NULL DEFAULT 0,
    "total_convertidos" INTEGER NOT NULL DEFAULT 0,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cliente_uid" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responsavel" TEXT NOT NULL,
    CONSTRAINT "TimelineEvent_cliente_uid_fkey" FOREIGN KEY ("cliente_uid") REFERENCES "User" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SalesAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cliente_id" TEXT NOT NULL,
    "cliente_nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL DEFAULT 'media',
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lido" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Estimate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cliente_uid" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "valor_total" REAL,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Estimate_cliente_uid_fkey" FOREIGN KEY ("cliente_uid") REFERENCES "User" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tempo" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
