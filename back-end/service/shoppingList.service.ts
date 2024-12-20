import shoppingListDb from "../repository/shoppingList.db";
import Item from "../model/item";
import ShoppingList from "../model/shoppingList";
import {ShoppingListInput, ItemInput} from "../types";
import itemDb from "../repository/item.db";
import {Privacy} from "@prisma/client";
import itemService from "./item.service";

const addShoppingList = async (input: ShoppingListInput): Promise<ShoppingList> => {
    try {
        const existingList = await shoppingListDb.getShoppingListByName(input.ListName || "General list");
        if (existingList) {
            throw new Error(`Shopping list with name ${input.ListName} already exists.`);
        }
        
        let items: Array<Item>;
        try {
            items = input.items?.map(item => Item.from(item)) || [];
        } catch (error) {
            console.log(error);
            throw new Error("There is an error with the items: " + error);
        }
    
        let newShoppingList: ShoppingList;
    
        try {
            newShoppingList = ShoppingList.from({
                ListName: input.ListName,
                items,
                privacy: input.privacy,
                owner: input.owner
            });
        } catch (error) {
            console.log(error);
            throw new Error("There is an error with the ShoppingList: " + error);
        }
    
        for (const item of items) {
            await itemDb.saveItem(item);
        }
        console.log(`Saving shopping list with name ${newShoppingList.getListName()}.`);
        return await shoppingListDb.saveShoppingList(newShoppingList);
    } catch (error) {
        console.error('Error adding shopping list:', error);
        throw new Error('Error adding shopping list: ' + error);
    }
};

const getShoppingList = async (name: string): Promise<ShoppingList | undefined> => {
    let shoppingList:ShoppingList | null;
    try {
        shoppingList = await shoppingListDb.getShoppingListByName(name);
        // console.log(shoppingList)
    } catch (error) {
        throw new Error("Service can't retrieve shopping lists from database: "+error)
    }

    if (shoppingList) {
        return shoppingList;
    } else {
        throw new Error(`Shopping list with name ${name} does not exist.`);
    }
};

const getAllShoppingLists = async (role?: 'admin' | 'adult' | 'child', username?: string): Promise<ShoppingList[]> => {
    if (role == 'admin') {
        return await shoppingListDb.getAllShoppingLists();
    } else if (role) {
        return await shoppingListDb.getAllShoppingLists(role, username);
    } else {
        return await shoppingListDb.getAllShoppingLists();
    }
};

const removeShoppingList = async (name: string): Promise<void> => {
    const shoppingList = await shoppingListDb.getShoppingListByName(name);

    if (shoppingList != undefined) {
        const items = shoppingList.getListItems();
        // items.forEach(async(item) => await itemDb.removeItem(item.getName()));
        shoppingListDb.removeShoppingList(name);
    } else {
        throw new Error(`Shopping list with name ${name} does not exist.`);
    }
};

const addItemToShoppingList = async (listName: string, itemInput: ItemInput): Promise<void> => {
    const shoppingList = await shoppingListDb.getShoppingListByName(listName);

    if (!shoppingList) {
        throw new Error(`Shopping list with name ${listName} does not exist.`);
    }

    // const items = await itemService.getAllItems(); //Maybe not needed, if the update in the db works
    const existingItem = shoppingList.getListItems().find((i) => i.getName() === itemInput.name);
    if (existingItem) {
        throw new Error(`Item with name ${itemInput.name} already exists in the shopping list ${listName}.`);
    }

    const newItem = new Item(itemInput);
    await itemService.addItem(itemInput);
    await shoppingListDb.addItemToShoppingList(listName, newItem);
};

const removeItemFromShoppingList = async (listName: string, itemName: string): Promise<void> => {
    const shoppingList = await shoppingListDb.getShoppingListByName(listName);

    if (shoppingList != undefined) {
        const existingItem = shoppingList.getListItems().find(item => item.getName() === itemName);
        if (existingItem) {
            // await itemDb.removeItem(itemName);
            await shoppingListDb.removeItemFromShoppingList(listName, itemName);

            const updatedList = await getShoppingList(listName);
            if (updatedList && updatedList?.getListItems().length < 1) {
                await removeShoppingList(listName);
            }
        } else {
            throw new Error(`Item with name ${itemName} does not exist in the shopping list ${listName}.`);
        }
    } else {
        throw new Error(`Shopping list with name ${listName} does not exist.`);
    }
};

const getShoppingListPrivacy = async (listName: string): Promise<string> => {
    const shoppingList = await shoppingListDb.getShoppingListByName(listName);

    if (shoppingList != undefined) {
        return shoppingList.getPrivacy();
    } else {
        throw new Error(`Shopping list with name ${listName} does not exist.`);
    }
};

const setShoppingListPrivacy = async (listName: string, privacy: Privacy): Promise<void> => {
    const shoppingList = await shoppingListDb.getShoppingListByName(listName);

    if (shoppingList != undefined) {
        shoppingList.setPrivacy(privacy);
        await shoppingListDb.saveShoppingList(shoppingList);
    } else {
        throw new Error(`Shopping list with name ${listName} does not exist.`);
    }
};

const getShoppingListOwner = async (listName: string): Promise<string> => {
    const shoppingList = await shoppingListDb.getShoppingListByName(listName);

    if (shoppingList != undefined) {
        return shoppingList.getOwner();
    } else {
        throw new Error(`Shopping list with name ${listName} does not exist.`);
    }
};

const setShoppingListOwner = async (listName: string, owner: string): Promise<void> => {
    const shoppingList = await shoppingListDb.getShoppingListByName(listName);

    if (shoppingList != undefined) {
        shoppingList.setOwner(owner);
        await shoppingListDb.saveShoppingList(shoppingList);
    } else {
        throw new Error(`Shopping list with name ${listName} does not exist.`);
    }
};

export default {
    
    getShoppingList,
    getAllShoppingLists,
    getShoppingListOwner,
    getShoppingListPrivacy,

    addShoppingList,
    addItemToShoppingList,
    setShoppingListOwner,
    setShoppingListPrivacy,
    
    removeItemFromShoppingList,
    removeShoppingList,
};