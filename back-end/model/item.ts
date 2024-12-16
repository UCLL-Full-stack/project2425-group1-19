import {Urgency} from "../types";

class Item {
    private name: string;
    public description: string;
    private price?: number;
    private urgency?: Urgency;


    constructor (item: {name: string, description: string, price?: number, urgency?: Urgency}) {
        this.validateitems(item);

        this.name = item.name;
        this.description = item.description;
        this.price = item.price;
        this.urgency = item.urgency || "low";
    }

    private validateitems = (item: {name: string, description: string, price?: number, urgency?: Urgency}) => {
        if (typeof item.name !== 'string' || item.name.length > 40) {
            throw new Error('Invalid name value');
        }

        if (typeof item.description !== 'string' || item.description.length > 240) {
            throw new Error('Invalid description value');
        }

        if (item.price !== undefined) {
            if (typeof item.price !== 'number' || !isFinite(item.price) || item.price < 0) {
                throw new Error('Invalid price value');
            }
        }
        
        const validUrgencies: Urgency[] = ['low', 'mid', 'high'];
        if (item.urgency !== undefined && !validUrgencies.includes(item.urgency)) {
            throw new Error('Invalid urgency value');
        }
    };

    getName = (): string => {
        return this.name;
    };
    getPrice = (): number => {
        if (this.price == undefined) {
            return 0;
        }
        else {
            return this.price;
        }
    }
    getUrgency = ():Urgency => {
        return this.urgency!;
    }


    static from = (data: any): Item => {
        return new Item({
            name: data.name,
            description: data.description,
            price: data.price,
            urgency: data.urgency
        });
    };
}

export default Item;
