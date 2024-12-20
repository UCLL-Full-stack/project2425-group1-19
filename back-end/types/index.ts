type Urgency = "low"|"mid"|"high";

type ItemInput = {
    name: string;
    description: string;
    price?: number;
    urgency?: Urgency;
}

type Privacy = 'public'|'adultOnly'|'private'

type ShoppingListInput = {
    ListName: string;
    items?: ItemInput[];
    privacy?:Privacy;
    owner?: string;
}

type UserInput = {
    id?: number;
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
    
    Privacy,
    Urgency
}
