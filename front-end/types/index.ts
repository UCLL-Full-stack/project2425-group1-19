type Privacy = 'public'|'adultOnly'|'private'

type ShoppingList  = {
    ListName: string;
    items?: Item[];
    privacy?:Privacy;
    owner?: string;
};

type Urgency = "low"|"mid"|"high";

type Item = {
    name?: string;
    description?: string;
    price?: number;
    urgency?: Urgency;
};

type User = {
    username: string;
    password: string;
    role: 'admin' | 'adult' | 'child';
};

type Profile = {
    email: string;
    name: string;
    lastname: string;
};

type AuthenticationResponse = {
    token: string;
    username: string;
    role: 'admin' | 'adult' | 'child';
};

export type {
    AuthenticationResponse,
    Privacy,
    Urgency,
    ShoppingList,
    User,
    Profile, Item,
};
