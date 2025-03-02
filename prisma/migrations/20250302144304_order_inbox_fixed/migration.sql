/*
  Warnings:

  - The `status` column on the `Bid` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InboxType" AS ENUM ('BID', 'ORDER', 'DISPATCH', 'DELIVERY', 'PICKUP', 'RETURN', 'CANCEL');

-- DropIndex
DROP INDEX "Bid_orderId_key";

-- AlterTable
ALTER TABLE "Bid" ALTER COLUMN "amount" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "BidStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "vehicleType" TEXT;

-- DropEnum
DROP TYPE "BillStatus";

-- CreateTable
CREATE TABLE "Inbox" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" "InboxType" NOT NULL DEFAULT 'BID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inbox_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
