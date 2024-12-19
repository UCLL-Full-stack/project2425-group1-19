import ShoppingList from "../model/shoppingList";
import Item from "../model/item";
import database from "./database";
import {Privacy} from "@prisma/client";

const saveShoppingList = async (shoppingList: ShoppingList): Promise<ShoppingList> => {
    const savedShoppingList = await database.shoppingList.create({
        data: {
            name: shoppingList.getListName(),
            privacy: shoppingList.getPrivacy(),
            owner: shoppingList.getOwner(),
            items: {
                create: shoppingList.getListItems().map(item => ({
                    name: item.getName(),
                    description: item.description,
                    price: item.getPrice(),
                    urgency: item.getUrgency(),
                })),
            },
        },
        include: {items: true},
    });
    return ShoppingList.from(savedShoppingList);
};

const getShoppingListByName = async (name: string): Promise<ShoppingList | null> => {
    const shoppingList = await database.shoppingList.findUnique({
        where: {name},
        include: {items: true},
    });
    if (shoppingList) {
        return ShoppingList.from(shoppingList);
    }
    return null;
};

const removeShoppingList = async (name: string): Promise<void> => {
    await database.shoppingList.delete({
        where: {name},
    });
};

const getAllShoppingLists = async (role?: 'admin' | 'adult' | 'child', username?: string): Promise<Array<ShoppingList>> => {
    let whereClause: any = {};

    if (role === 'admin') {
        // Admin can see all lists
        whereClause = {};
    } else if (role === 'adult') {
        // Adult can see public, adult only, and their own private lists
        whereClause = {
            OR: [
                { privacy: Privacy.public },
                { privacy: Privacy.adultOnly },
                { AND: [{ privacy: Privacy.private }, { owner: username }] },
            ],
        };
    } else if (role === 'child') {
        // Child can see public and their own private lists
        whereClause = {
            OR: [
                { privacy: Privacy.public },
                { AND: [{ privacy: Privacy.private }, { owner: username }] },
            ],
        };
    }

    const shoppingListsData = await database.shoppingList.findMany({
        where: whereClause,
        include: { items: true },
    });

    return shoppingListsData.map(list => ShoppingList.from(list));
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


export default {
    saveShoppingList,
    getShoppingListByName,
    removeShoppingList,
    getAllShoppingLists,
    addItemToShoppingList,
    removeItemFromShoppingList,
};
