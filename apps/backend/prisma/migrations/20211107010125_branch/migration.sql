/*
  Warnings:

  - You are about to drop the column `appId` on the `Deployment` table. All the data in the column will be lost.
  - Added the required column `appID` to the `Deployment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch` to the `Deployment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Deployment" DROP CONSTRAINT "Deployment_appId_fkey";

-- AlterTable
ALTER TABLE "Deployment" DROP COLUMN "appId",
ADD COLUMN     "appID" TEXT NOT NULL,
ADD COLUMN     "branch" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_appID_fkey" FOREIGN KEY ("appID") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
