type ItemInput = {
    name: string;
    description: string;
    price?: number;
    urgency?: string;
}

type ShoppingListInput = {
    ListName?: string;
    items?: ItemInput[];
}

type UserInput = {
    username: string;
    password: string;
    role: 'admin' | 'adult' | 'child';
}

type ProfileInput = {
    email: string;
    name: string;
    lastName: string;
    userId: number;
}

type AuthenticationResponse = {
    token: string;
    username: string;
    role: 'admin' | 'adult' | 'child';
};

export {
    ItemInput,
    ShoppingListInput,
    UserInput,
    ProfileInput,
    AuthenticationResponse,
}
