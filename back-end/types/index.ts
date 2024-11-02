type ItemInput = {
    name: string;
    description: string;
    price?: number;
    urgency?: string | number;
}

type ShoppingListInput = {
    ListName?: string;
    items?: ItemInput[];
}

type UserInput = {
    username: string;
    password: string;
    role: string;
}

type ProfileInput = {
    email: string;
    name: string;
    lastname: string;
}

export {
    ItemInput,
    ShoppingListInput,
    UserInput,
    ProfileInput,
}
