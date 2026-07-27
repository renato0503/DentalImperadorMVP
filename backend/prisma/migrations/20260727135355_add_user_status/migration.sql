-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "papel" TEXT NOT NULL DEFAULT 'cliente',
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
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("ativo", "churn_risk", "cpf_cnpj", "criado_em", "email", "endereco", "frequencia_cluster", "id", "limite_credito", "nome", "nota_interna", "origem", "papel", "propensao_compra", "proximo_contato", "segmento", "telefone", "ticket_cluster", "total_gasto", "uid", "ultima_compra", "ultimo_contato", "vendedor_nome", "vendedor_uid") SELECT "ativo", "churn_risk", "cpf_cnpj", "criado_em", "email", "endereco", "frequencia_cluster", "id", "limite_credito", "nome", "nota_interna", "origem", "papel", "propensao_compra", "proximo_contato", "segmento", "telefone", "ticket_cluster", "total_gasto", "uid", "ultima_compra", "ultimo_contato", "vendedor_nome", "vendedor_uid" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
