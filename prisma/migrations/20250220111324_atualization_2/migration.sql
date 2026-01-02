/*
  Warnings:

  - You are about to drop the column `CICLOVENDA` on the `Tags` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "CICLOVENDA",
ADD COLUMN     "CICLOVIDA" TEXT;
