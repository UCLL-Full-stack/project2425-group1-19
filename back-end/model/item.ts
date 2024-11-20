class Item {
    private name: string;
    public description: string;
    private price?: number;
    private urgency?: string;


    constructor (item: {name: string, description: string, price?: number, urgency?: string}) {
        this.validateitems(item);

        this.name = item.name;
        this.description = item.description;
        this.price = item.price;
        this.urgency = this.convertUrgency(item.urgency);
    }

    private validateitems = (item: {name: string, description: string, price?: number, urgency?: string}) => {
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

        const validUrgencies = ['Not a Priority', 'Low Priority', 'High Priority'];
        if (typeof item.urgency === "string" && (!validUrgencies.includes(item.urgency))) {
            throw new Error('Invalid urgency value');
        } else if (typeof item.urgency === "number") {
            if (item.urgency < 1 || item.urgency > 3) {
                throw new Error('Invalid urgency value');
            }
        } else if (item.urgency !== undefined && typeof item.urgency !== "string") {
            throw new Error('Invalid urgency value');
        }
    };

    private convertUrgency = (urgency?: string | number): string => {
        const validUrgencies = ['Not a Priority', 'Low Priority', 'High Priority'];
        if (typeof urgency === "number") {
            return validUrgencies[urgency - 1];
        }
        return urgency || 'Not a Priority';
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
    getUrgency = () => {
        return this.urgency;
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
