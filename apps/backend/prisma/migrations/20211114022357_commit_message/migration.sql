/*
  Warnings:

  - Added the required column `commitMessage` to the `Deployment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deployment" ADD COLUMN     "commitMessage" TEXT NOT NULL;
