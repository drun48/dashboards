/*
  Warnings:

  - You are about to drop the column `gridColumns` on the `Dashboard` table. All the data in the column will be lost.
  - You are about to drop the column `layoutVersion` on the `Dashboard` table. All the data in the column will be lost.

*/
-- AlterTable
-- IF EXISTS allows retrying after the original migration partially applied.
ALTER TABLE "Dashboard" DROP COLUMN IF EXISTS "gridColumns",
DROP COLUMN IF EXISTS "layoutVersion";
