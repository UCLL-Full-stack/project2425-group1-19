import shoppingListDb from "../repository/shoppingList.db";
import Item from "../model/item";
import ShoppingList from "../model/shoppingList";
import { ShoppingListInput, ItemInput } from "../types";

const addShoppingList = (input: ShoppingListInput): ShoppingList => {
    const existingList = shoppingListDb.getShoppingListByName(input.ListName || "General list");
    if (existingList) {
        throw new Error(`Shopping list with name ${input.ListName} already exists.`);
    }

    //Om zeker te zijn dat de list voldoet aan de regels
    const items = input.items?.map(item => new Item(item)) || [];
    const newShoppingList = new ShoppingList({ ListName: input.ListName, items });
    return shoppingListDb.saveShoppingList(newShoppingList);
};

const getShoppingList = (name: string): ShoppingList | undefined => {
    const shoppingList = shoppingListDb.getShoppingListByName(name);

    if (shoppingList != undefined) {
        return shoppingList;
    } else {
        throw new Error(`Shopping list with name ${name} does not exist.`);
    }
};

const getAllShoppingLists = (): ShoppingList[] => {
    return shoppingListDb.getAllShoppingLists();
};

const removeShoppingList = (name: string): void => {
    const shoppingList = shoppingListDb.getShoppingListByName(name);

    if (shoppingList != undefined) {
        shoppingListDb.removeShoppingList(name);
    } else {
        throw new Error(`Shopping list with name ${name} does not exist.`);
    }
};

const addItemToShoppingList = (listName: string, ItemInput: ItemInput): void => {
    const shoppingList = shoppingListDb.getShoppingListByName(listName);

    if (shoppingList != undefined) {
        const existingItem = shoppingList.getListItems().find(item => item.getName() === ItemInput.name);
        if (existingItem) {
            throw new Error(`Item with name ${ItemInput.name} already exists in the shopping list ${listName}.`);
        }

        const newItem = new Item(ItemInput);
        shoppingListDb.addItemToShoppingList(listName, newItem);
    } else {
        throw new Error(`Shopping list with name ${listName} does not exist.`);
    }
};

const removeItemFromShoppingList = (listName: string, itemName: string): void => {
    const shoppingList = shoppingListDb.getShoppingListByName(listName);

    if (shoppingList != undefined) {
        const existingItem = shoppingList.getListItems().find(item => item.getName() === itemName);
        if (existingItem) {
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