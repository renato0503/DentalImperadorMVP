-- AlterTable: papel -> role, add permissions, teamId
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "limite_credito" REAL,
    "total_gasto" REAL,
    "ultima_compra" DATETIME,
    "origem" TEXT DEFAULT 'Manual',
    "ticket_cluster" TEXT,
    "frequencia_cluster" TEXT,
    "vendedor_uid" TEXT,
    "vendedor_nome" TEXT,
    "propensao_compra" REAL,
    "ultimo_contato" DATETIME,
    "proximo_contato" DATETIME,
    "nota_interna" TEXT,
    "churn_risk" TEXT,
    "endereco" TEXT,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("id","uid","email","nome","status","ativo","cpf_cnpj","telefone","segmento","limite_credito","total_gasto","ultima_compra","origem","ticket_cluster","frequencia_cluster","vendedor_uid","vendedor_nome","propensao_compra","ultimo_contato","proximo_contato","nota_interna","churn_risk","endereco","criado_em")
SELECT "id","uid","email","nome","status","ativo","cpf_cnpj","telefone","segmento","limite_credito","total_gasto","ultima_compra","origem","ticket_cluster","frequencia_cluster","vendedor_uid","vendedor_nome","propensao_compra","ultimo_contato","proximo_contato","nota_interna","churn_risk","endereco","criado_em" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "User_teamId_idx" ON "User"("teamId");
