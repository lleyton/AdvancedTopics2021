/*
  Warnings:

  - A unique constraint covering the columns `[appID,commitID,branch]` on the table `Deployment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Deployment_appID_commitID_branch_key" ON "Deployment"("appID", "commitID", "branch");
