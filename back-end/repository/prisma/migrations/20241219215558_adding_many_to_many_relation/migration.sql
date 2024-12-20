/*
  Warnings:

  - You are about to drop the column `shoppingListId` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_shoppingListId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "shoppingListId";

-- CreateTable
CREATE TABLE "ShoppingListItem" (
    "shoppingListId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "ShoppingListItem_pkey" PRIMARY KEY ("shoppingListId","itemId")
);

-- AddForeignKey
ALTER TABLE "ShoppingListItem" ADD CONSTRAINT "ShoppingListItem_shoppingListId_fkey" FOREIGN KEY ("shoppingListId") REFERENCES "ShoppingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingListItem" ADD CONSTRAINT "ShoppingListItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
