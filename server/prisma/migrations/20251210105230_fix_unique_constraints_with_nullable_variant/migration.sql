/*
  Warnings:

  - A unique constraint covering the columns `[productId,variantId]` on the table `ProductDimension` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,variantId]` on the table `ProductSpecification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX IF EXISTS "ProductDimension_productId_key";

-- DropIndex
DROP INDEX IF EXISTS "ProductSpecification_productId_key";

-- AlterTable
ALTER TABLE "ProductDimension" ADD COLUMN     "thickness" DOUBLE PRECISION,
ADD COLUMN     "variantId" TEXT;

-- AlterTable
ALTER TABLE "ProductSpecification" ADD COLUMN     "variantId" TEXT;

-- CreateIndex
CREATE INDEX "ProductDimension_productId_idx" ON "ProductDimension"("productId");

-- CreateIndex
CREATE INDEX "ProductDimension_variantId_idx" ON "ProductDimension"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDimension_productId_variantId_key" ON "ProductDimension"("productId", "variantId") WHERE "variantId" IS NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductDimension_productId_null_key" ON "ProductDimension"("productId") WHERE "variantId" IS NULL;

-- CreateIndex
CREATE INDEX "ProductSpecification_variantId_idx" ON "ProductSpecification"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSpecification_productId_variantId_key" ON "ProductSpecification"("productId", "variantId") WHERE "variantId" IS NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductSpecification_productId_null_key" ON "ProductSpecification"("productId") WHERE "variantId" IS NULL;

-- AddForeignKey
ALTER TABLE "ProductSpecification" ADD CONSTRAINT "ProductSpecification_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDimension" ADD CONSTRAINT "ProductDimension_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
