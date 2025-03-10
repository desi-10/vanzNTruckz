/*
  Warnings:

  - You are about to drop the column `image` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "image",
ADD COLUMN     "imageOne" JSONB,
ADD COLUMN     "imageTwo" JSONB;
