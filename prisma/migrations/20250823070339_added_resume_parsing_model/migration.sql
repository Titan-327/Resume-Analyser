/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the `Analysis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Analysis" DROP CONSTRAINT "Analysis_resumeId_fkey";

-- AlterTable
ALTER TABLE "public"."Resume" DROP COLUMN "fileUrl",
ADD COLUMN     "analysisText" TEXT,
ADD COLUMN     "latex" JSONB,
ADD COLUMN     "score" TEXT;

-- DropTable
DROP TABLE "public"."Analysis";
