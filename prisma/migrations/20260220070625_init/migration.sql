/*
  Warnings:

  - The `status` column on the `Submission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `language` on the `Submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'RUNNING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('CPP', 'PYTHON', 'JAVA');

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "language",
ADD COLUMN     "language" "Language" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING';
