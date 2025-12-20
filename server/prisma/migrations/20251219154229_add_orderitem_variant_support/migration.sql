/*
  Warnings:

  - A unique constraint covering the columns `[orderId,productId,variantId]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX IF EXISTS "OrderItem_orderId_productId_key";

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "variantId" TEXT;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "reservedStock" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE INDEX "OrderItem_variantId_idx" ON "OrderItem"("variantId");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex (Partial indexes for proper NULL handling)
CREATE UNIQUE INDEX "OrderItem_orderId_productId_variantId_key" 
ON "OrderItem"("orderId", "productId", "variantId") 
WHERE "variantId" IS NOT NULL;

CREATE UNIQUE INDEX "OrderItem_orderId_productId_no_variant_unique"
ON "OrderItem"("orderId", "productId")
WHERE "variantId" IS NULL;