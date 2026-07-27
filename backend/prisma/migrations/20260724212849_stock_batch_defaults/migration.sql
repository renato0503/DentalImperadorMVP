-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StockBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "filial" INTEGER NOT NULL DEFAULT 0,
    "lote" TEXT NOT NULL DEFAULT '',
    "validade" DATETIME,
    "quantidade" INTEGER NOT NULL,
    "reservado" INTEGER NOT NULL DEFAULT 0,
    "disponivel" INTEGER NOT NULL,
    "giro_30d" REAL,
    "lead_time_reposicao" INTEGER,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StockBatch_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Product" ("sku") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StockBatch" ("atualizado_em", "criado_em", "disponivel", "filial", "giro_30d", "id", "lead_time_reposicao", "lote", "quantidade", "reservado", "sku", "validade") SELECT "atualizado_em", "criado_em", "disponivel", "filial", "giro_30d", "id", "lead_time_reposicao", "lote", "quantidade", coalesce("reservado", 0) AS "reservado", "sku", "validade" FROM "StockBatch";
DROP TABLE "StockBatch";
ALTER TABLE "new_StockBatch" RENAME TO "StockBatch";
CREATE INDEX "StockBatch_sku_idx" ON "StockBatch"("sku");
CREATE UNIQUE INDEX "StockBatch_sku_filial_lote_key" ON "StockBatch"("sku", "filial", "lote");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
