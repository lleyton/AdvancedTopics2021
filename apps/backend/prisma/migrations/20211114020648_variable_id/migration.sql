/*
  Warnings:

  - The primary key for the `Variable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[appID,usage,scope,name]` on the table `Variable` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Variable` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Variable" DROP CONSTRAINT "Variable_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Variable_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Variable_appID_usage_scope_name_key" ON "Variable"("appID", "usage", "scope", "name");
