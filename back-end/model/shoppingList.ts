import {Privacy} from "../types";
import Item from "./item";
class ShoppingList {
    private ListName?: string;
    private items?: Array<Item>;
    private privacy?: Privacy;
    private owner?: string;

    constructor (shoppingList: {ListName?: string, items?: Array<Item>,  privacy?: Privacy,  owner?:string}) {
        this.validate(shoppingList)

        this.ListName = shoppingList.ListName?.trim() || "General list";
        this.items = shoppingList.items || [];
        this.privacy == shoppingList.privacy || 'public';
        this.owner == shoppingList.owner || 'GeneralUser';
    };

    private validate = (shoppingList: {ListName?: string, items?: Array<Item>, privacy?: Privacy, owner?:string}) => {
        if (shoppingList.ListName == undefined) {
            this.items = []
        }
        else if (typeof shoppingList.ListName !== 'string' || shoppingList.ListName.trim() === '' || shoppingList.ListName.length > 40) {
            throw new Error('Invalid ListName value');
        };

        if (shoppingList.items == undefined) {

        }
        else if (!Array.isArray(shoppingList.items)) {
            throw new Error('Invalid items value');
        };

        if (shoppingList.items) {
            for (const item of shoppingList.items) {
                if (!(item instanceof Item)) {
                    throw new Error('Invalid item in items array');
                }
            }
        };

        if (this.privacy && !('public,adultOnly,private'.includes(this.privacy?.toString()))) {
            throw new Error('Privacy can only be set to the following values: public, adultOnly, private')
        }

        if (this.owner && !(typeof(this.owner) =="string")) {
            throw new Error('Invalid owner name')
        }
    }

    static from(data: any): ShoppingList {
        const items = data.items.map((item: any) => new Item(item));
        return new ShoppingList({
            ListName: data.name,
            items: items,
            privacy: data.privacy,
            owner: data.owner
        });
    }

    getListName = (): string => {
        return this.ListName!;
    };

    getListItems = (): Array<Item> => {
        return this.items!;
    };

    addItem = (item: Item): void => {
        if (!(item instanceof Item)) {
            throw new Error('Invalid item');
        }
        this.items!.push(item);
    };

    removeItem = (name: string): void => {
        this.items = this.items!.filter(item => item.getName() !== name);
    };

    getPrivacy = (): Privacy => {
        return this.privacy!;
    };

    setPrivacy = (privacy: Privacy): void => {
        if (!('public,adultOnly,private'.includes(privacy.toString()))) {
            throw new Error('privacy can only be set to the following values: public, adultOnly, private');
        }
        this.privacy = privacy;
    };

    getOwner = (): string => {
        return this.owner!;
    };

    setOwner = (owner: string): void => {
        if (typeof owner !== 'string' || owner.trim() === '') {
            throw new Error('Invalid owner name');
        }
        this.owner = owner;
    };

    /* not needed implement in service 
    buyItem = (name: string): void => {
        const item = this.items!.find(item => item.getName() === name);
        if (item) {
            this.removeItem(name);
        } else {
            throw new Error('Item not found');
        }
    }*/
};

export default ShoppingList;