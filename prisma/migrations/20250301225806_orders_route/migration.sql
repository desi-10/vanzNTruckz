-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "deliveryTime" TEXT,
ADD COLUMN     "driverSnapshot" JSONB,
ADD COLUMN     "pickUpAddress" TEXT,
ADD COLUMN     "pickUpTime" TEXT;
