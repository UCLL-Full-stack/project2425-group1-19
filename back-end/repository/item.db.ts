import Item from "../model/item";

const items: Array<Item> = [];

const saveItem = (item: Item): Item => {
    items.push(item);
    return item;
};

const getItemByName = ({name}: {name: string}): Item | undefined => {
    try {
        return items.find((item) => {item.getName() === name}) || undefined;
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

const removeItem = (name: string): void => {
    const index = items.findIndex(item => item.getName() === name);
    if (index !== -1) {
        items.splice(index, 1);
    } else {
        throw new Error(`Item with name ${name} not found.`);
    }
};

const getAllItems = (): Array<Item> => {
    return items;
};

const createTestItems = (): void => {
    const itemslist = [
        new Item({name: "Milk", description: "1 gallon of whole milk", price: 3.99, urgency: "High Priority"}),
        new Item({name: "Bread", description: "Whole grain bread", price: 2.49, urgency: "Not a Priority"}),
        new Item({name: "Eggs", description: "Dozen large eggs", price: 2.99, urgency: "High Priority"}),
        new Item({name: "Cheese", description: "Cheddar cheese block", price: 4.99, urgency: 2}),
        new Item({name: "Apples", description: "1 kg of red apples", price: 3.49, urgency: 2}),
        new Item({name: "Chicken Breast", description: "1 kg of boneless chicken breast", price: 7.99, urgency: "High Priority"}),
        new Item({name: "Tomatoes", description: "1 kg of fresh tomatoes", price: 2.99, urgency: "Low Priority"}), 
        new Item({name: "Pens", description: "Pack of 10 blue pens", price: 5.99, urgency: "Low Priority"}),
        new Item({name: "Notebooks", description: "Pack of 3 notebooks", price: 7.99, urgency: "High Priority"})
    ]
    itemslist.forEach((item) => saveItem(item))
    
};
createTestItems();

export default {
    saveItem,
    getItemByName,
    removeItem,
    getAllItems,

};