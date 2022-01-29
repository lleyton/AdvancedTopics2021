-- CreateEnum
CREATE TYPE "DeploymentStatus" AS ENUM ('PENDING', 'DEPLOYING', 'ACTIVE', 'FAILED', 'DEAD');

-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "commitID" TEXT NOT NULL,
    "status" "DeploymentStatus" NOT NULL,
    "appId" TEXT NOT NULL,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
