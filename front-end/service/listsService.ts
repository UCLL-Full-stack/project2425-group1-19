const backendUrl = process.env.NEXT_PUBLIC_API_URL;

if (!backendUrl) {
    throw new Error('Backend URL is not defined in the environment variables');
}

const getShoppingLists = async () => {
    const response = await fetch(`${backendUrl}/shoppingList`);
    if (!response.ok) {
        throw new Error('Failed to fetch shopping lists');
    }
    return response.json();
};

const getShoppingList = async (name: string) => {
    const response = await fetch(`${backendUrl}/shoppingList/${name}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch shopping list: ${name}`);
    }
    return response.json();
};

const addShoppingList = async (list: { ListName: string, items: any[] }) => {
    const response = await fetch(`${backendUrl}/shoppingList`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(list),
    });
    if (!response.ok) {
        throw new Error('Failed to add shopping list');
    }
    return response.json();
};

const removeShoppingList = async (name: string) => {
    const response = await fetch(`${backendUrl}/shoppingList/${name}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to remove shopping list: ${name}`);
    }
    return response.json();
};

const addItemToShoppingList = async (listName: string, item: { name: string, description: string, price: number, urgency: string }) => {
    const response = await fetch(`${backendUrl}/shoppingList/${listName}/item`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    });
    if (!response.ok) {
        throw new Error(`Failed to add item to shopping list: ${listName}`);
    }
    return response.json();
};

const removeItemFromShoppingList = async (listName: string, itemName: string) => {
    const response = await fetch(`${backendUrl}/shoppingList/${listName}/item/${itemName}`, {
        method: 'DELETE',
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