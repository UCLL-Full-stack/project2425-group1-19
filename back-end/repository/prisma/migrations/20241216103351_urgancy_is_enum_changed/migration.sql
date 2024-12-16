/*
  Warnings:

  - The values [NotAPriority,LowPriority,HighPriority] on the enum `Urgency` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Urgency_new" AS ENUM ('low', 'mid', 'high');
ALTER TABLE "Item" ALTER COLUMN "urgency" DROP DEFAULT;
ALTER TABLE "Item" ALTER COLUMN "urgency" TYPE "Urgency_new" USING ("urgency"::text::"Urgency_new");
ALTER TYPE "Urgency" RENAME TO "Urgency_old";
ALTER TYPE "Urgency_new" RENAME TO "Urgency";
DROP TYPE "Urgency_old";
ALTER TABLE "Item" ALTER COLUMN "urgency" SET DEFAULT 'low';
COMMIT;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "urgency" SET DEFAULT 'low';
