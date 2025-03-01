/*
  Warnings:

  - The `carPicture` column on the `Driver` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `profilePicture` column on the `Driver` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `image` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "carPicture",
ADD COLUMN     "carPicture" JSONB,
DROP COLUMN "profilePicture",
ADD COLUMN     "profilePicture" JSONB;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
ADD COLUMN     "image" JSONB;
