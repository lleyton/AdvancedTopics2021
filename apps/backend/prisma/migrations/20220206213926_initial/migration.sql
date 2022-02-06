-- CreateEnum
CREATE TYPE "Role" AS ENUM ('NORMAL', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "ContainerModel" AS ENUM ('LIGHT', 'BASIC', 'PLUS', 'UBER');

-- CreateEnum
CREATE TYPE "DeploymentStatus" AS ENUM ('PENDING', 'DEPLOYING', 'ACTIVE', 'FAILED', 'DEAD');

-- CreateEnum
CREATE TYPE "DeploymentType" AS ENUM ('PREVIEW', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "VariableScope" AS ENUM ('PREVIEW', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "VariableUsage" AS ENUM ('BUILD', 'RUN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "userID" TEXT NOT NULL,
    "projectID" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'NORMAL',

    CONSTRAINT "Member_pkey" PRIMARY KEY ("userID","projectID")
);

-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "model" "ContainerModel" NOT NULL,
    "minReplicas" INTEGER NOT NULL,
    "maxReplicas" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectID" TEXT NOT NULL,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "commitID" TEXT NOT NULL,
    "status" "DeploymentStatus" NOT NULL,
    "appID" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "DeploymentType" NOT NULL,
    "commitMessage" TEXT NOT NULL,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variable" (
    "id" TEXT NOT NULL,
    "appID" TEXT NOT NULL,
    "usage" "VariableUsage" NOT NULL,
    "scope" "VariableScope" NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Variable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Deployment_appID_commitID_branch_key" ON "Deployment"("appID", "commitID", "branch");

-- CreateIndex
CREATE UNIQUE INDEX "Variable_appID_usage_scope_name_key" ON "Variable"("appID", "usage", "scope", "name");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_appID_fkey" FOREIGN KEY ("appID") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variable" ADD CONSTRAINT "Variable_appID_fkey" FOREIGN KEY ("appID") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
