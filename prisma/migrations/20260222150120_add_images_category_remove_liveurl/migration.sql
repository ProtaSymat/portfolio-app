/*
  Warnings:

  - You are about to drop the column `liveUrl` on the `projects` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('personal', 'professional', 'academic');

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "liveUrl",
ADD COLUMN     "category" "ProjectCategory" NOT NULL DEFAULT 'personal',
ADD COLUMN     "images" TEXT[];
