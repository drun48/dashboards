/*
  Warnings:

  - You are about to drop the column `connectionId` on the `DataSource` table. All the data in the column will be lost.
  - You are about to drop the `Connection` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `DataSource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urlConnect` to the `DataSource` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChartView" DROP CONSTRAINT "ChartView_dataSourceId_fkey";

-- DropForeignKey
ALTER TABLE "DataContent" DROP CONSTRAINT "DataContent_dataSourceId_fkey";

-- DropForeignKey
ALTER TABLE "DataSource" DROP CONSTRAINT "DataSource_connectionId_fkey";

-- AlterTable
ALTER TABLE "DataSource" DROP COLUMN "connectionId",
ADD COLUMN     "type" "TypeConnection" NOT NULL,
ADD COLUMN     "urlConnect" TEXT NOT NULL;

-- DropTable
DROP TABLE "Connection";

-- CreateTable
CREATE TABLE "DataSet" (
    "id" SERIAL NOT NULL,
    "connectionId" INTEGER NOT NULL,

    CONSTRAINT "DataSet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChartView" ADD CONSTRAINT "ChartView_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "DataSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSet" ADD CONSTRAINT "DataSet_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "DataSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataContent" ADD CONSTRAINT "DataContent_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "DataSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
