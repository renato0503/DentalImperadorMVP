-- DropIndex
DROP INDEX IF EXISTS "StockBatch_sku_idx";
DROP INDEX IF EXISTS "StockBatch_sku_filial_lote_key";

-- CreateIndex
CREATE UNIQUE INDEX "StockBatch_sku_key" ON "StockBatch"("sku");
