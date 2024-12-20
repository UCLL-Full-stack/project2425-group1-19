import Item from "../model/item";
import database from "./database";

//const items: Array<Item> = [];

const saveItem = async(item: Item): Promise<Item> => {
    const savedItem = await database.item.create({
        data: {
            name: item.getName(),
            description: item.description,
            price: item.getPrice(),
            urgency: item.getUrgency(),
        },
    });
    return Item.from(savedItem);
};

const getItemIdByName = async (name: string): Promise<number | null> => {
    try {
        const item = await database.item.findMany({
            where: { name },
            select: { id: true },
        });
        return item ? item[0].id : null;
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

const getItemByName = async({name}: {name: string}): Promise<Item | undefined>  => {
    try {
        
        const item = await database.item.findUnique({
            where: {name: name},
        });
        if (!item) {
            return undefined;
        }
        return Item.from(item);
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

const removeItem = async (name: string): Promise<void> => {
    try {
        const item = await database.item.findUnique({
            where: { name },
        });

        if (!item) {
            console.error(`Item with name ${name} not found.`); // Log a warning instead of throwing an error
            return;
        }

        await database.item.delete({
            where: { id: item.id },
        });
    } catch (error) {
        console.error(`Error removing item with name ${name}:`, error);
        throw new Error(`Error removing item with name ${name}`);
    }
};

const getAllItems = async (): Promise<Array<Item>> => {
    const items = await database.item.findMany();
    const items_array = items.map((i) => Item.from(i));
    return items_array;
};

export default {
    saveItem,
    getItemByName,
    removeItem,
    getAllItems,
    getItemIdByName,
    
};
