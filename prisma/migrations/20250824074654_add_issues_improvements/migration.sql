/*
  Warnings:

  - You are about to drop the column `analysisText` on the `Resume` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Resume" DROP COLUMN "analysisText",
ADD COLUMN     "improvements" TEXT,
ADD COLUMN     "issues" TEXT;
