-- CreateEnum
CREATE TYPE "public"."ChartTypeContent" AS ENUM ('BAR', 'LINE', 'PIE', 'DONUT');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ChartType_new" AS ENUM ('MULTIPLE', 'SINGL');
ALTER TABLE "public"."Chart" ALTER COLUMN "type" TYPE "public"."ChartType_new" USING ("type"::text::"public"."ChartType_new");
ALTER TYPE "public"."ChartType" RENAME TO "ChartType_old";
ALTER TYPE "public"."ChartType_new" RENAME TO "ChartType";
DROP TYPE "ChartType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Chart" DROP CONSTRAINT "Chart_datasetId_fkey";

-- AlterTable
ALTER TABLE "public"."Chart" DROP COLUMN "datasetId",
DROP COLUMN "labelColumn",
DROP COLUMN "valueColumn";

-- CreateTable
CREATE TABLE "public"."ChartContent" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT,
    "type" "public"."ChartTypeContent" NOT NULL,
    "labelColumn" TEXT NOT NULL,
    "valueColumn" TEXT NOT NULL,
    "chartId" TEXT NOT NULL,

    CONSTRAINT "ChartContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ChartContent" ADD CONSTRAINT "ChartContent_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "public"."Chart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChartContent" ADD CONSTRAINT "ChartContent_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "public"."Dataset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
