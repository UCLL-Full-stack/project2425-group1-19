import React, { useState } from 'react';
import { Item } from '@/types';

type Props = {
    onAddItem: (item: Item) => void;
};

const AddItemRow: React.FC<Props> = ({ onAddItem }) => {
    const [newItem, setNewItem] = useState<Item>({
        name: '',
        description: '',
        price: 0,
        urgency: 'Not a Priority'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewItem(prevItem => ({
            ...prevItem,
            [name]: value
        }));
    };

    const handleAddItem = () => {
        //console.log('Adding item:', newItem);
        onAddItem(newItem);
        // Reset the form after adding the item
        setNewItem({
            name: '',
            description: '',
            price: 0,
            urgency: 'Not a Priority'
        });
    };
    const isFormValid = newItem.name && newItem.description;

    return (
        <tr>
            <td><input type="text" name="name" placeholder="Name" value={newItem.name} onChange={handleChange} required/></td>
            <td><input type="text" name="description" placeholder="Description" value={newItem.description} onChange={handleChange} required/></td>
            <td><input type="number" name="price" placeholder="Price" value={newItem.price} onChange={handleChange}/></td>
            <td>
                <select name="urgency" value={newItem.urgency} onChange={handleChange} required defaultValue={"Not a Priority"}>
                    <option value="Not a Priority">1- Not a Priority</option>
                    <option value="Low Priority">2- Low Priority</option>
                    <option value="High Priority">3- High Priority</option>
                </select>
            </td>
            <td><button onClick={handleAddItem} disabled={!isFormValid}>Add Item</button></td>
        </tr>
    );
};

export default AddItemRow;
