/*
  Warnings:

  - The `urgency` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('NotAPriority', 'LowPriority', 'HighPriority');

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "urgency",
ADD COLUMN     "urgency" "Urgency" NOT NULL DEFAULT 'NotAPriority';
