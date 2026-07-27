-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProductImage_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Product" ("sku") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT,
    "subcategoria" TEXT,
    "marca" TEXT,
    "descricao_html" TEXT,
    "imagem_url" TEXT,
    "preco_tabela" REAL,
    "preco_promocional" REAL,
    "ncm" TEXT,
    "unidade" TEXT,
    "controlado_anvisa" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Product" ("categoria", "controlado_anvisa", "criado_em", "id", "ncm", "nome", "preco_promocional", "preco_tabela", "sku") SELECT "categoria", "controlado_anvisa", "criado_em", "id", "ncm", "nome", "preco_promocional", "preco_tabela", "sku" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ProductImage_sku_idx" ON "ProductImage"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_sku_order_key" ON "ProductImage"("sku", "order");
