/*
  Warnings:

  - You are about to drop the column `refreshAt` on the `Dataset` table. All the data in the column will be lost.
  - You are about to drop the column `fetchedAt` on the `DatasetSnapshot` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `DatasetSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dataset" DROP COLUMN "refreshAt";

-- AlterTable
ALTER TABLE "DatasetSnapshot" DROP COLUMN "fetchedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
