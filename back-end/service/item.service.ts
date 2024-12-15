import Item from "../model/item";
import itemDb from "../repository/item.db";
import { ItemInput } from "../types";

const addItem = async(input: ItemInput): Promise<Item> => {
    try {
        const existingItem = await itemDb.getItemByName({ name: input.name });
        if (existingItem) {
            throw new Error(`Item with name ${input.name} already exists.`);
        }
        //Om zeker te zijn dat de item voldoet aan de regels
        const newItem = Item.from(input);
        return itemDb.saveItem(newItem);
    } catch (error) {
        throw new Error(`Item with name ${input.name} already exists.`)
    }
        
};

const getItem = async(name: string): Promise<Item | undefined> => {
    const item = await itemDb.getItemByName({ name });

    if (item != undefined) {
        return item;
    } else {
        throw new Error(`Item with name ${name} does not exist.`);
    }
};

const getAllItems = async(): Promise<Item[]> => {
    return await itemDb.getAllItems();
};

const removeItem = async(name: string): Promise<void> => {
    const item = await itemDb.getItemByName({ name });

    if (item != undefined) {
        itemDb.removeItem(name);
    } else {
        throw new Error(`Item with name ${name} does not exist.`);
    }
};


export default {
    addItem,
    getItem,
    getAllItems,
    removeItem,
};