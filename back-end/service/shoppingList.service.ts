import shoppingListDb from "../repository/shoppingList.db";
import Item from "../model/item";
import ShoppingList from "../model/shoppingList";
import { ShoppingListInput, ItemInput } from "../types";
import itemDb from "../repository/item.db";

const addShoppingList = async(input: ShoppingListInput): Promise<ShoppingList> => {
    const existingList = await shoppingListDb.getShoppingListByName(input.ListName || "General list");
    if (existingList) {
        throw new Error(`Shopping list with name ${input.ListName} already exists.`);
    }

    const items = input.items?.map(item => new Item(item)) || [];
    const newShoppingList = new ShoppingList({ ListName: input.ListName, items });
    items.forEach(item => itemDb.saveItem(item));
    return shoppingListDb.saveShoppingList(newShoppingList);
};

const getShoppingList = async(name: string): Promise<ShoppingList | undefined> => {
    const shoppingList = await shoppingListDb.getShoppingListByName(name);

    if (shoppingList != undefined) {
        return shoppingList;
    } else {
        throw new Error(`Shopping list with name ${name} does not exist.`);
    }
};

const getAllShoppingLists = async(): Promise<ShoppingList[]> => {
    return await shoppingListDb.getAllShoppingLists();
};

const removeShoppingList = async(name: string): Promise<void> => {
    const shoppingList = await shoppingListDb.getShoppingListByName(name);

    if (shoppingList != undefined) {
        const items = shoppingList.getListItems();
        items.forEach(item => itemDb.removeItem(item.getName()));
        shoppingListDb.removeShoppingList(name);
    } else {
        throw new Error(`Shopping list with name ${name} does not exist.`);
    }
};

const addItemToShoppingList = async(listName: string, ItemInput: ItemInput): Promise<void> => {
    const shoppingList = await shoppingListDb.getShoppingListByName(listName);

    if (shoppingList != undefined) {
        const existingItem = shoppingList.getListItems().find(item => item.getName() === ItemInput.name);
        if (existingItem) {
            throw new Error(`Item with name ${ItemInput.name} already exists in the shopping list ${listName}.`);
        }

        const newItem = new Item(ItemInput);
        itemDb.saveItem(newItem);
        shoppingListDb.addItemToShoppingList(listName, newItem);
    } else {
        throw new Error(`Shopping list with name ${listName} does not exist.`);
    }
};

const removeItemFromShoppingList = async(listName: string, itemName: string): Promise<void> => {
    const shoppingList = await shoppingListDb.getShoppingListByName(listName);

    if (shoppingList != undefined) {
        const existingItem = shoppingList.getListItems().find(item => item.getName() === itemName);
        if (existingItem) {
            itemDb.removeItem(itemName);
            shoppingListDb.removeItemFromShoppingList(listName, itemName);
        } else {
            throw new Error(`Item with name ${itemName} does not exist in the shopping list ${listName}.`);
        }
    } else {
        throw new Error(`Shopping list with name ${listName} does not exist.`);
    }
};

export default {
    addShoppingList,
    getShoppingList,
    getAllShoppingLists,
    removeShoppingList,
    addItemToShoppingList,
    removeItemFromShoppingList,
};