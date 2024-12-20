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
                    item: {
                        create: {
                            name: item.getName(),
                            description: item.description,
                            price: item.getPrice(),
                            urgency: item.getUrgency(),
                        }
                    }
                })),
            },
        },
        include: {
            items: {
                include: {
                    item: true,
                },
            },
        },
    });
    const shoppingListWithItems = {
        id: savedShoppingList.id,
        ListName: savedShoppingList.name,
        privacy: savedShoppingList.privacy,
        owner: savedShoppingList.owner,
        items: savedShoppingList.items.map((listItem: any) => ({
            id: listItem.item.id,
            name: listItem.item.name,
            description: listItem.item.description,
            price: listItem.item.price,
            urgency: listItem.item.urgency,
        })),
    };
    return ShoppingList.from(shoppingListWithItems);
};

const getShoppingListByName = async (name: string): Promise<ShoppingList | null> => {
    const shoppingList = await database.shoppingList.findUnique({
        where: { name: name },
        include: {
            items: {
                include: {
                    item: true,
                },
            },
        },
    });

    //from werk niet alleen, god weet waarom
    if (shoppingList) {
        console.log('Shopping list from DB:', shoppingList);
        const shoppingListWithItems = {
            id: shoppingList.id,
            ListName: shoppingList.name, 
            privacy: shoppingList.privacy,
            owner: shoppingList.owner,
            items: shoppingList.items.map((listItem: any) => ({
                id: listItem.item.id,
                name: listItem.item.name,
                description: listItem.item.description,
                price: listItem.item.price,
                urgency: listItem.item.urgency,
            })),
        };
        console.log('Shopping list with items:', shoppingListWithItems);
        return ShoppingList.from(shoppingListWithItems);
    }
    return null;
};

const removeShoppingList = async (name: string): Promise<void> => {
    const shoppingList = await database.shoppingList.findUnique({
        where: { name },
        include: { items: true },
    });

    if (shoppingList) {
        // Remove related items from ShoppingListItem table
        await database.shoppingListItem.deleteMany({
            where: { shoppingListId: shoppingList.id },
        });

        // Remove the shopping list
        await database.shoppingList.delete({
            where: { id: shoppingList.id },
        });
    } else {
        throw new Error(`Shopping list with name ${name} does not exist.`);
    }
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
        include: {
            items: {
                include: {
                    item: true,
                },
            },
        },
    });
    // console.log("Retrieved shopping lists data:", shoppingListsData);

    return shoppingListsData.map(list => {
        // console.log("Processing shopping list:", list);
        const shoppingListWithItems = {
            id: list.id,
            ListName: list.name, 
            privacy: list.privacy,
            owner: list.owner,
            items: list.items.map((listItem) => ({
                id: listItem.item.id,
                name: listItem.item.name,
                description: listItem.item.description,
                price: listItem.item.price,
                urgency: listItem.item.urgency,
            })),
        };
        // console.log("Shopping list with items:", shoppingListWithItems);
        return ShoppingList.from(shoppingListWithItems);
    });
};

const addItemToShoppingList = async (listName: string, item: Item): Promise<void> => {
    const shoppingList = await database.shoppingList.findUnique({
        where: { name: listName },
    });

    if (!shoppingList) {
        throw new Error(`Shopping list with name ${listName} not found.`);
    }

    const existingItem = await database.item.findUnique({
        where: { name: item.getName() },
    });

    if (!existingItem) {
        await database.item.create({
            data: {
                name: item.getName(),
                description: item.description,
                price: item.getPrice(),
                urgency: item.getUrgency(),
            },
        });
    }

    await database.shoppingList.update({
        where: { name: listName },
        data: {
            items: {
                connectOrCreate: {
                    where: {
                        shoppingListId_itemId: {
                            shoppingListId: shoppingList.id,
                            itemId: existingItem ? existingItem.id : item.getId(),
                        },
                    },
                    create: {
                        item: {
                            connect: { id: existingItem ? existingItem.id : item.getId()},
                        },
                    },
                },
            },
        },
    });
};

const removeItemFromShoppingList = async (listName: string, itemName: string): Promise<void> => {
    const shoppingList = await database.shoppingList.findUnique({
        where: { name: listName },
        include: {
            items: {
                include: {
                    item: true,
                },
            },
        },
    });

    if (!shoppingList) {
        throw new Error(`Shopping list with name ${listName} not found.`);
    }

    const item = await database.item.findUnique({
        where: { name: itemName },
    });

    if (!item) {
        throw new Error(`Item with name ${itemName} not found.`);
    }

    await database.$transaction(async (prisma) => {
        await prisma.shoppingListItem.delete({
            where: {
                shoppingListId_itemId: {
                    shoppingListId: shoppingList.id,
                    itemId: item.id,
                },
            },
        });

        // Optionally, delete the item if it is no longer associated with any shopping list
        const itemAssociations = await prisma.shoppingListItem.findMany({
            where: { itemId: item.id },
        });

        if (itemAssociations.length === 0) {
            await prisma.item.delete({
                where: { id: item.id },
            });
        }
    });
};


export default {
    saveShoppingList,
    getShoppingListByName,
    removeShoppingList,
    getAllShoppingLists,
    addItemToShoppingList,
    removeItemFromShoppingList,
};
