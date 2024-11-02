type ShoppingList  = {
    ListName: string;
    items: Item[]
};

type Item = {
    name: string;
    description: string;
    price?: number;
    urgency?: string | number;
};

type User = {
    username: string;
    password: string;
    role: string;
};

type Profile = {
    email: string;
    name: string;
    lastname: string;
};

export type {
    ShoppingList,
    Item,
    User,
    Profile,
};
