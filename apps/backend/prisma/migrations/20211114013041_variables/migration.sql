-- CreateEnum
CREATE TYPE "VariableScope" AS ENUM ('PREVIEW', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "VariableUsage" AS ENUM ('BUILD', 'RUN');

-- CreateTable
CREATE TABLE "Variable" (
    "appID" TEXT NOT NULL,
    "stage" "VariableUsage" NOT NULL,
    "scope" "VariableScope" NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Variable_pkey" PRIMARY KEY ("appID","stage","scope","name")
);

-- AddForeignKey
ALTER TABLE "Variable" ADD CONSTRAINT "Variable_appID_fkey" FOREIGN KEY ("appID") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
