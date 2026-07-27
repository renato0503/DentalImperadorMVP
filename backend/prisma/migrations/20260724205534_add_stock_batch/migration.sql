-- CreateTable
CREATE TABLE "StockBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "filial" INTEGER NOT NULL,
    "lote" TEXT NOT NULL,
    "validade" DATETIME,
    "quantidade" INTEGER NOT NULL,
    "reservado" INTEGER,
    "disponivel" INTEGER NOT NULL,
    "giro_30d" REAL,
    "lead_time_reposicao" INTEGER,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StockBatch_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Product" ("sku") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "StockBatch_sku_idx" ON "StockBatch"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "StockBatch_sku_filial_lote_key" ON "StockBatch"("sku", "filial", "lote");
