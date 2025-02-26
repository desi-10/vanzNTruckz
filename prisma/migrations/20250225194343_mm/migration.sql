/*
  Warnings:

  - The `paymentMethod` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentOption" AS ENUM ('CASH', 'CARD', 'MOBILE_MONEY');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'SUPER_ADMIN';

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentOption" NOT NULL DEFAULT 'CASH';
