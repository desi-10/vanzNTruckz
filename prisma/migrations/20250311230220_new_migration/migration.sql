/*
  Warnings:

  - You are about to drop the column `dropOff` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pickUp` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleType` on the `Order` table. All the data in the column will be lost.
  - Added the required column `dropOffPoint` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickUpPoint` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "dropOff",
DROP COLUMN "pickUp",
DROP COLUMN "vehicleType",
ADD COLUMN     "dropOffPoint" TEXT NOT NULL,
ADD COLUMN     "pickUpPoint" TEXT NOT NULL,
ADD COLUMN     "vehicleId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "VehicleType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "VehicleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
