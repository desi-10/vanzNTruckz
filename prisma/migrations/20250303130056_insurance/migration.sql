/*
  Warnings:

  - The `insuranceSticker` column on the `Driver` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `roadworthySticker` column on the `Driver` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "ghanaCardPicture" JSONB,
ADD COLUMN     "insurance" TEXT,
ADD COLUMN     "licensePicture" JSONB,
ADD COLUMN     "numberPlatePicture" JSONB,
DROP COLUMN "insuranceSticker",
ADD COLUMN     "insuranceSticker" JSONB,
DROP COLUMN "roadworthySticker",
ADD COLUMN     "roadworthySticker" JSONB;
