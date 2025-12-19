/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId,variantId]` on the table `UserCart` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX IF EXISTS "UserCart_userId_productId_key";

-- AlterTable
ALTER TABLE "UserCart" ADD COLUMN     "variantId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UserCart_userId_productId_variantId_key" ON "UserCart"("userId", "productId", "variantId");

-- AddForeignKey
ALTER TABLE "UserCart" ADD CONSTRAINT "UserCart_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "UserCart_userId_productId_null_variant" 
ON "UserCart"("userId", "productId") 
WHERE "variantId" IS NULL;