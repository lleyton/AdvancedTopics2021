/*
  Warnings:

  - Added the required column `type` to the `Deployment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeploymentType" AS ENUM ('PREVIEW', 'PRODUCTION');

-- AlterTable
ALTER TABLE "Deployment" ADD COLUMN     "type" "DeploymentType" NOT NULL;
