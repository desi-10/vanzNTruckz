/*
  Warnings:

  - A unique constraint covering the columns `[license]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "license" TEXT,
ADD COLUMN     "vehicleType" TEXT,
ALTER COLUMN "carPicture" DROP NOT NULL,
ALTER COLUMN "insuranceSticker" DROP NOT NULL,
ALTER COLUMN "licenseExpiry" DROP NOT NULL,
ALTER COLUMN "numberPlate" DROP NOT NULL,
ALTER COLUMN "profilePicture" DROP NOT NULL,
ALTER COLUMN "roadworthyExpiry" DROP NOT NULL,
ALTER COLUMN "roadworthySticker" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Driver_license_key" ON "Driver"("license");
