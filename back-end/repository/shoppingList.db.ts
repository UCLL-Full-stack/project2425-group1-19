import ShoppingList from "../model/shoppingList";
import Item from "../model/item";
import database from "./database";

// const shoppingLists: Map<string, Array<Item>> = new Map();

const saveShoppingList = async (shoppingList: ShoppingList): Promise<ShoppingList> => {
    const savedShoppingList = await database.shoppingList.create({
        data: {
            name: shoppingList.getListName(),
            items: {
                create: shoppingList.getListItems().map(item => ({
                    name: item.getName(),
                    description: item.description,
                    price: item.getPrice(),
                    urgency: item.getUrgency(),
                })),
            },
        },
    });
    return savedShoppingList;
};

const getShoppingListByName = async (name: string): Promise<ShoppingList | null> => {
    const shoppingList = await database.shoppingList.findUnique({
        where: {name},
        include: {items: true},
    });
    if (shoppingList) {
        const items: Item[] = shoppingList.items.map((item: any) => new Item({
            name: item.getName(),
            description: item.description,
            price: item.getPrice(),
            urgency: item.getUrgency(),
        }));
        return new ShoppingList({ListName: name, items});
    }
    return null;
};

const removeShoppingList = async (name: string): Promise<void> => {
    await database.shoppingList.delete({
        where: {name},
    });
};

const getAllShoppingLists = async (): Promise<Array<ShoppingList>> => {
    const shoppingLists:ShoppingList[] = await database.shoppingList.findMany({
        include: {items: true},
    });
    return shoppingLists.map((list) => new ShoppingList({
        ListName: list.getListName(),
        items: list.getListItems().map((item: Item) => new Item({
            name: item.getName(),
            description: item.description,
            price: item.getPrice(),
            urgency: item.getUrgency(),
        })),
    }));
};

const addItemToShoppingList = async (listName: string, item: Item): Promise<void> => {
    const shoppingList = await database.shoppingList.update({
        where: {name: listName},
        data: {
            items: {
                create: {
                    name: item.getName(),
                    description: item.description,
                    price: item.getPrice(),
                    urgency: item.getUrgency(),
                },
            },
        },
    });
    if (!shoppingList) {
        throw new Error(`Shopping list with name ${listName} not found.`);
    }
};

const removeItemFromShoppingList = async (listName: string, itemName: string): Promise<void> => {
    const shoppingList = await database.shoppingList.update({
        where: {name: listName},
        data: {
            items: {
                deleteMany: {
                    name: itemName,
                },
            },
        },
    });
    if (!shoppingList) {
        throw new Error(`Shopping list with name ${listName} not found.`);
    }
};

const createTestShoppingLists = (): void => {
    const list1 = new ShoppingList({
        ListName: "Carrefour", items: [
            new Item({name: "Milk", description: "1 gallon of whole milk", price: 3.99, urgency: "High Priority"}),
            new Item({name: "Bread", description: "Whole grain bread", price: 2.49, urgency: "Not a Priority"}),
            new Item({name: "Eggs", description: "Dozen large eggs", price: 2.99, urgency: "High Priority"}),
            new Item({name: "Cheese", description: "Cheddar cheese block", price: 4.99, urgency: 2}),
            new Item({name: "Apples", description: "1 kg of red apples", price: 3.49, urgency: 2}),
            new Item({name: "Chicken Breast", description: "1 kg of boneless chicken breast", price: 7.99, urgency: "High Priority"}),
            new Item({name: "Tomatoes", description: "1 kg of fresh tomatoes", price: 2.99, urgency: "Low Priority"})
        ]
    });
    const list2 = new ShoppingList({
        ListName: "Acco", items: [
            new Item({name: "Pens", description: "Pack of 10 blue pens", price: 5.99, urgency: "Low Priority"}),
            new Item({name: "Notebooks", description: "Pack of 3 notebooks", price: 7.99, urgency: "High Priority"})
        ]
    });
    saveShoppingList(list1);
    saveShoppingList(list2);
}

//createTestShoppingLists();

export default {
    saveShoppingList,
    getShoppingListByName,
    removeShoppingList,
    getAllShoppingLists,
    addItemToShoppingList,
    removeItemFromShoppingList,
};
