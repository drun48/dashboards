/*
  Warnings:

  - You are about to drop the column `lastError` on the `Dataset` table. All the data in the column will be lost.
  - You are about to drop the column `refreshStartedAt` on the `Dataset` table. All the data in the column will be lost.
  - Added the required column `link` to the `DataSource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataSource" ADD COLUMN     "link" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Dataset" DROP COLUMN "lastError",
DROP COLUMN "refreshStartedAt",
ADD COLUMN     "refreshAt" TIMESTAMP(3);
