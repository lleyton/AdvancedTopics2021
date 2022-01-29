/*
  Warnings:

  - The primary key for the `Variable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stage` on the `Variable` table. All the data in the column will be lost.
  - Added the required column `usage` to the `Variable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Variable" DROP CONSTRAINT "Variable_pkey",
DROP COLUMN "stage",
ADD COLUMN     "usage" "VariableUsage" NOT NULL,
ADD CONSTRAINT "Variable_pkey" PRIMARY KEY ("appID", "usage", "scope", "name");
