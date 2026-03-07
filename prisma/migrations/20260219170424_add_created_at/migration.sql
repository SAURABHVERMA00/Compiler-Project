/*
  Warnings:

  - Added the required column `difficulty` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `TestCase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "difficulty" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TestCase" ADD COLUMN     "order" INTEGER NOT NULL;
