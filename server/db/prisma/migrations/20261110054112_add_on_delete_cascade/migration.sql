-- DropForeignKey
ALTER TABLE "ChartContent" DROP CONSTRAINT "ChartContent_chartId_fkey";

-- AddForeignKey
ALTER TABLE "ChartContent" ADD CONSTRAINT "ChartContent_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "Chart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
