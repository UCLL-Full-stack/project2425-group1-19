import React, {useState} from 'react';
import {Item} from '@/types';

type Props = {
    onAddItem: (item: Item, newShoppingListName?:string) => void;
    onNeedRefresh: () => void;
    shoppingListName: string;
};

const AddItemForm: React.FC<Props> = ({onAddItem,onNeedRefresh, shoppingListName}) => {
    const [newItem, setNewItem] = useState<Item>({
        name: '',
        description: '',
        price: 0,
        urgency: 'mid'
    });
    const [listName, setListName] = useState<string>(shoppingListName);
    const [toAddListName, setToAddListName] = useState<string>(shoppingListName);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setNewItem(prevItem => ({
            ...prevItem,
            [name]: value
        }));
    };

    const validateItem = (item: Item): string | null => {
        setErrorMessage(null);
        
        if (typeof item.name !== 'string' || item.name.length > 40) {
            return 'Invalid name value';
        }

        if (typeof item.description !== 'string' || item.description.length > 4000) {
            return 'Invalid description value';
        }

        if (item.price !== undefined) {
            if (typeof item.price !== 'number' || !isFinite(item.price) || item.price < 0) {
                return 'Invalid price value';
            }
        }

        const validUrgencies: string[] = ['low', 'mid', 'high'];
        if (item.urgency !== undefined && !validUrgencies.includes(item.urgency)) {
            return 'Invalid urgency value';
        }

        return null;
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationError = validateItem(newItem);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        setErrorMessage(null);

        if (!shoppingListName && toAddListName) {
            onAddItem(newItem, toAddListName);
        } else {
            onAddItem(newItem);
        }

        // Reset the form after adding the item
        setNewItem({
            name: '',
            description: '',
            price: 0,
            urgency: 'mid'
        });
        setListName('');

        //Refresh lists
        await onNeedRefresh()
    };
    const isFormValid = newItem.name && newItem.description;

    return (
        <div className="flex flex-col items-center p-4">
            <h3 className='text-xl font-semibold mt-6 mb-2'>Add an Item to the shoppingList</h3>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            <form onSubmit={handleAddItem} className="w-full max-w-lg bg-transparent p-6 rounded-lg shadow-md">
                {listName === '' && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ListName">
                            Shopping List name
                        </label>
                        <input
                            type="text"
                            name="ListName"
                            id="ListName"
                            placeholder="Shopping List name"
                            value={toAddListName}
                            onChange={(e) => setToAddListName(e.target.value)}
                            autoCorrect='false'
                            autoComplete='false'
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Item Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Name"
                        value={newItem.name}
                        onChange={handleChange}
                        autoCorrect='false'
                        autoComplete='false'
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Description"
                        value={newItem.description}
                        onChange={handleChange}
                        autoCorrect='false'
                        autoComplete='false'
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                        Price
                    </label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        placeholder="Price"
                        value={newItem.price}
                        onChange={handleChange}
                        autoCorrect='false'
                        autoComplete='false'
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="urgency">
                        Urgency
                    </label>
                    <select
                        name="urgency"
                        id="urgency"
                        value={newItem.urgency}
                        onChange={handleChange}
                        autoCorrect='false'
                        autoComplete='false'
                        required
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option value="low">1- Low priority</option>
                        <option value="mid">2- Midium priority</option>
                        <option value="high">3- High priority</option>
                    </select>
                </div>
                <div className="mb-4">
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        // onSubmit={(e) => {e.preventDefault(); handleAddItem();}}
                        className="w-full bg-blue-500 text-white px-3 py-2 rounded disabled:opacity-50"
                    >
                        Add Item
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddItemForm;
