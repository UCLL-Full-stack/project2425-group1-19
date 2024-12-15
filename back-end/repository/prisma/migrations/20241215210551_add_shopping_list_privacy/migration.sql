-- CreateEnum
CREATE TYPE "Privacy" AS ENUM ('public', 'adultOnly', 'private');

-- AlterTable
ALTER TABLE "ShoppingList" ADD COLUMN     "privacy" "Privacy" NOT NULL DEFAULT 'public';
