/*
  Warnings:

  - You are about to drop the column `deliveryAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryTime` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `finalPrice` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pickUpAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pickUpTime` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `priceId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `receipientName` on the `Order` table. All the data in the column will be lost.
  - Added the required column `BaseCharges` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distanceCharges` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dropOff` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parcelType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickUp` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pieces` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recepientName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeCharges` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalEstimatedFare` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `recepientNumber` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vehicleType` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_priceId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryAddress",
DROP COLUMN "deliveryTime",
DROP COLUMN "finalPrice",
DROP COLUMN "pickUpAddress",
DROP COLUMN "pickUpTime",
DROP COLUMN "priceId",
DROP COLUMN "receipientName",
ADD COLUMN     "AdditionalCharges" DECIMAL(65,30),
ADD COLUMN     "BaseCharges" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "distanceCharges" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "dropOff" TEXT NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "parcelType" TEXT NOT NULL,
ADD COLUMN     "pickUp" TEXT NOT NULL,
ADD COLUMN     "pieces" INTEGER NOT NULL,
ADD COLUMN     "recepientName" TEXT NOT NULL,
ADD COLUMN     "timeCharges" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "totalEstimatedFare" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "recepientNumber" SET NOT NULL,
ALTER COLUMN "vehicleType" SET NOT NULL;
