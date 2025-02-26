/*
  Warnings:

  - You are about to drop the column `email` on the `TwoFactorToken` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userAddress` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `TwoFactorToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone,token]` on the table `TwoFactorToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `TwoFactorToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TwoFactorToken_email_token_key";

-- AlterTable
ALTER TABLE "TwoFactorToken" DROP COLUMN "email",
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phoneNumber",
DROP COLUMN "userAddress",
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorToken_phone_key" ON "TwoFactorToken"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorToken_phone_token_key" ON "TwoFactorToken"("phone", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
