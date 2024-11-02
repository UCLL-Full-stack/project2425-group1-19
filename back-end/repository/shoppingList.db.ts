import ShoppingList from "../model/shoppingList";
import Item from "../model/item";

const shoppingLists: Map<string, Array<Item>> = new Map();

const saveShoppingList = (shoppingList: ShoppingList): ShoppingList => {
    shoppingLists.set(shoppingList.getListName(), shoppingList.getListItems());
    return shoppingList;
}

const getShoppingListByName = (name: string): ShoppingList | undefined => {
    const items = shoppingLists.get(name);
    if (items) {
        return new ShoppingList({ ListName: name, items });
    }
    return undefined;
}

const removeShoppingList = (name: string): void => {
    if (!shoppingLists.delete(name)) {
        throw new Error(`Shopping list with name ${name} not found.`);
    }
}

const getAllShoppingLists = (): Array<ShoppingList> => {
    return Array.from(shoppingLists.entries()).map(([name, items]) => new ShoppingList({ ListName: name, items }));
}

const addItemToShoppingList = (listName: string, item: Item): void => {
    const items = shoppingLists.get(listName);
    if (items) {
        items.push(item);
    } else {
        throw new Error(`Shopping list with name ${listName} not found.`);
    }
}

const removeItemFromShoppingList = (listName: string, itemName: string): void => {
    const items = shoppingLists.get(listName);
    if (items) {
        const index = items.findIndex(item => item.getName() === itemName);
        if (index !== -1) {
            items.splice(index, 1);
        } else {
            throw new Error(`Item with name ${itemName} not found in shopping list ${listName}.`);
        }
    } else {
        throw new Error(`Shopping list with name ${listName} not found.`);
    }
}

const createTestShoppingLists = (): void => {
    const list1 = new ShoppingList({ ListName: "Carrefour", items: [
        new Item({ name: "Milk", description: "1 gallon of whole milk", price: 3.99, urgency: "High Priority" }),
        new Item({ name: "Bread", description: "Whole grain bread", price: 2.49, urgency: "Not a Priority" }),
        new Item({ name: "Eggs", description: "Dozen large eggs", price: 2.99, urgency: "High Priority" }),
        new Item({ name: "Cheese", description: "Cheddar cheese block", price: 4.99, urgency: 2 }),
        new Item({ name: "Apples", description: "1 kg of red apples", price: 3.49, urgency: 2 }),
        new Item({ name: "Chicken Breast", description: "1 kg of boneless chicken breast", price: 7.99, urgency: "High Priority" }),
        new Item({ name: "Tomatoes", description: "1 kg of fresh tomatoes", price: 2.99, urgency: "Low Priority" })
    ]});
    const list2 = new ShoppingList({ ListName: "Acco", items: [
        new Item({ name: "Pens", description: "Pack of 10 blue pens", price: 5.99, urgency: "Low Priority" }),
        new Item({ name: "Notebooks", description: "Pack of 3 notebooks", price: 7.99, urgency: "High Priority" })
    ]});
    saveShoppingList(list1);
    saveShoppingList(list2);
}

createTestShoppingLists();

export default {
    saveShoppingList,
    getShoppingListByName,
    removeShoppingList,
    getAllShoppingLists,
    addItemToShoppingList,
    removeItemFromShoppingList,
};