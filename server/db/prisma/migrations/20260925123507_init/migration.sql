-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('TEXT', 'CHART');

-- CreateEnum
CREATE TYPE "ChartType" AS ENUM ('Pie', 'Donut', 'Bar', 'Line');

-- CreateEnum
CREATE TYPE "CurveType" AS ENUM ('LINEAR', 'MONOTONE', 'STEP');

-- CreateEnum
CREATE TYPE "TypeConnection" AS ENUM ('PostgreSQL', 'GoogleSheet');

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" SERIAL NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "w" DOUBLE PRECISION NOT NULL,
    "h" DOUBLE PRECISION NOT NULL,
    "dashboardId" INTEGER NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentBlock" (
    "id" SERIAL NOT NULL,
    "type" "ContentType" NOT NULL DEFAULT 'TEXT',
    "title" TEXT,
    "description" TEXT,
    "settings" JSONB NOT NULL,
    "text" TEXT,

    CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chart" (
    "id" SERIAL NOT NULL,
    "chartId" INTEGER NOT NULL,

    CONSTRAINT "Chart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartView" (
    "id" SERIAL NOT NULL,
    "type" "ChartType" NOT NULL,
    "dataSourceId" INTEGER,
    "labelColumn" TEXT NOT NULL,
    "valueColumn" TEXT NOT NULL,
    "colorScheme" TEXT,
    "showLegend" BOOLEAN NOT NULL DEFAULT true,
    "showTooltip" BOOLEAN NOT NULL DEFAULT true,
    "innerRadius" DOUBLE PRECISION,

    CONSTRAINT "ChartView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" SERIAL NOT NULL,
    "urlConnect" TEXT NOT NULL,
    "type" "TypeConnection" NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSource" (
    "id" SERIAL NOT NULL,
    "connectionId" INTEGER NOT NULL,

    CONSTRAINT "DataSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataContent" (
    "id" SERIAL NOT NULL,
    "header" TEXT NOT NULL,
    "idRow" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "dataSourceId" INTEGER NOT NULL,
    "lastFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlockToContentBlock" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BlockToContentBlock_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ChartToContentBlock" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ChartToContentBlock_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ChartToChartView" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ChartToChartView_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DataContent_dataSourceId_key" ON "DataContent"("dataSourceId");

-- CreateIndex
CREATE INDEX "_BlockToContentBlock_B_index" ON "_BlockToContentBlock"("B");

-- CreateIndex
CREATE INDEX "_ChartToContentBlock_B_index" ON "_ChartToContentBlock"("B");

-- CreateIndex
CREATE INDEX "_ChartToChartView_B_index" ON "_ChartToChartView"("B");

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartView" ADD CONSTRAINT "ChartView_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "DataSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSource" ADD CONSTRAINT "DataSource_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataContent" ADD CONSTRAINT "DataContent_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "DataSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockToContentBlock" ADD CONSTRAINT "_BlockToContentBlock_A_fkey" FOREIGN KEY ("A") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockToContentBlock" ADD CONSTRAINT "_BlockToContentBlock_B_fkey" FOREIGN KEY ("B") REFERENCES "ContentBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChartToContentBlock" ADD CONSTRAINT "_ChartToContentBlock_A_fkey" FOREIGN KEY ("A") REFERENCES "Chart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChartToContentBlock" ADD CONSTRAINT "_ChartToContentBlock_B_fkey" FOREIGN KEY ("B") REFERENCES "ContentBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChartToChartView" ADD CONSTRAINT "_ChartToChartView_A_fkey" FOREIGN KEY ("A") REFERENCES "Chart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChartToChartView" ADD CONSTRAINT "_ChartToChartView_B_fkey" FOREIGN KEY ("B") REFERENCES "ChartView"("id") ON DELETE CASCADE ON UPDATE CASCADE;
