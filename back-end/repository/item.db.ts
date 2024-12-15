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

const getItemByName = async({name}: {name: string}): Promise<Item | null>  => {
    try {
        
        const item = await database.item.findUnique({
            where: {name: name},
        });
        if (!item) {
            throw new Error("No item found with name:" + name)
        }
        return Item.from(item);
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

const removeItem = async (name: string): Promise<void> => {
    try {
        const id = await getItemIdByName(name)
        if (!id) {
            throw new Error("No Item found with name:"+name);
        };
        await database.item.delete({
            where: { id },
        });
    } catch (error) {
        throw new Error(`Item with name ${name} not found.`);
    }
};

const getAllItems = async (): Promise<Array<Item>> => {
    const items = await database.item.findMany();
    const items_array = items.map((i) => Item.from(i));
    return items_array;
};

// const createTestItems = (): void => {
//     const itemslist = [
//         new Item({name: "Milk", description: "1 gallon of whole milk", price: 3.99, urgency: "High Priority"}),
//         new Item({name: "Bread", description: "Whole grain bread", price: 2.49, urgency: "Not a Priority"}),
//         new Item({name: "Eggs", description: "Dozen large eggs", price: 2.99, urgency: "High Priority"}),
//         new Item({name: "Cheese", description: "Cheddar cheese block", price: 4.99, urgency: "Not a Priority"}),
//         new Item({name: "Apples", description: "1 kg of red apples", price: 3.49, urgency: "Not a Priority"}),
//         new Item({name: "Chicken Breast", description: "1 kg of boneless chicken breast", price: 7.99, urgency: "High Priority"}),
//         new Item({name: "Tomatoes", description: "1 kg of fresh tomatoes", price: 2.99, urgency: "Low Priority"}), 
//         new Item({name: "Pens", description: "Pack of 10 blue pens", price: 5.99, urgency: "Low Priority"}),
//         new Item({name: "Notebooks", description: "Pack of 3 notebooks", price: 7.99, urgency: "High Priority"})
//     ]
//     itemslist.forEach((item) => saveItem(item))
    
// };

//createTestItems();

export default {
    saveItem,
    getItemByName,
    removeItem,
    getAllItems,
    getItemIdByName,
    
};
