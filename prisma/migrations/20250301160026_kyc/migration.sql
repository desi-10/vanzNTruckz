/*
  Warnings:

  - You are about to drop the column `license` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleType` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the `Bill` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[numberPlate]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `carPicture` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `insuranceSticker` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licenseExpiry` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberPlate` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicture` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roadworthyExpiry` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roadworthySticker` to the `Driver` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_orderId_fkey";

-- DropIndex
DROP INDEX "Driver_license_key";

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "license",
DROP COLUMN "vehicleType",
ADD COLUMN     "carPicture" TEXT NOT NULL,
ADD COLUMN     "ghanaCard" TEXT,
ADD COLUMN     "insuranceSticker" TEXT NOT NULL,
ADD COLUMN     "licenseExpiry" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "numberPlate" TEXT NOT NULL,
ADD COLUMN     "profilePicture" TEXT NOT NULL,
ADD COLUMN     "roadworthyExpiry" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "roadworthySticker" TEXT NOT NULL;

-- DropTable
DROP TABLE "Bill";

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "BillStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bid_orderId_key" ON "Bid"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_numberPlate_key" ON "Driver"("numberPlate");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
