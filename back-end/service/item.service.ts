import Item from "../model/item";
import itemDb from "../repository/item.db";
import { ItemInput } from "../types";

const addItem = (input: ItemInput): Item => {
    try {
        const existingItem = itemDb.getItemByName({ name: input.name });
        if (existingItem) {
            throw new Error(`Item with name ${input.name} already exists.`);
        }
        //Om zeker te zijn dat de item voldoet aan de regels
        const newItem = new Item(input);
        return itemDb.saveItem(newItem);
    } catch (error) {
        throw new Error(`Item with name ${input.name} already exists.`)
    }
        
};

const getItem = (name: string): Item | undefined => {
    const item = itemDb.getItemByName({ name });

    if (item != undefined) {
        return item;
    } else {
        throw new Error(`Item with name ${name} does not exist.`);
    }
};

const getAllItems = (): Item[] => {
    return itemDb.getAllItems();
};

const removeItem = (name: string): void => {
    const item = itemDb.getItemByName({ name });

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