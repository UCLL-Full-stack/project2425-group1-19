import {AuthenticationResponse, Item} from "@/types";
import userService from "./userService";
const backendUrl = process.env.NEXT_PUBLIC_API_URL;

if (!backendUrl) {
    throw new Error('Backend URL is not defined in the environment variables');
}

const getShoppingLists = async () => {
    const token:AuthenticationResponse = userService.getLocalStorageFields();
    const response = await fetch(`${backendUrl}/shoppingList?username=${token.username}&role=${token.role}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token.token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch shopping lists');
    }
    return response.json();
};

const getShoppingList = async (name: string) => {
    const token = userService.getLocalStorageFields();
    const response = await fetch(`${backendUrl}/shoppingList/${name}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token.token}`,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch shopping list: ${name}`);
    }
    return response.json();
};

const addShoppingList = async (list: {ListName: string, items: any[]}) => {
    const token = userService.getLocalStorageFields();
    const response = await fetch(`${backendUrl}/shoppingList`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token.token}`,
        },
        body: JSON.stringify(list),
    });
    if (!response.ok) {
        throw new Error('Failed to add shopping list');
    }
    return response.json();
};

const removeShoppingList = async (name: string) => {
    const token = userService.getLocalStorageFields();
    const response = await fetch(`${backendUrl}/shoppingList/${name}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token.token}`,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to remove shopping list: ${name}`);
    }
    return response.json();
};

const addItemToShoppingList = async (listName: string, item: Item) => {
    const token = userService.getLocalStorageFields();
    const itemWithDefaultPrice = {
        ...item,
        price: item.price !== undefined ? Number(item.price) : 0
    };

    const response = await fetch(`${backendUrl}/shoppingList/${listName}/item`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token.token}`,
        },
        body: JSON.stringify(itemWithDefaultPrice),
    });
    if (!response.ok) {
        throw new Error(`Failed to add item to shopping list: ${listName}`);
    }
    return response.json();
};

const removeItemFromShoppingList = async (listName: string, itemName: string) => {
    const token = userService.getLocalStorageFields();
    const response = await fetch(`${backendUrl}/shoppingList/${listName}/item/${itemName}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token.token}`,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to remove item from shopping list: ${listName}`);
    }
    return response.json();
};

export {
    getShoppingLists,
    getShoppingList,
    addItemToShoppingList,
    addShoppingList,
    removeItemFromShoppingList,
    removeShoppingList,
}