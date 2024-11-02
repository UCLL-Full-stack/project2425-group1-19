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
        urgency: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewItem(prevItem => ({
            ...prevItem,
            [name]: value
        }));
    };

    const handleAddItem = () => {
        console.log('Adding item:', newItem);
        onAddItem(newItem);
    };

    return (
        <tr>
            <td><input type="text" name="name" placeholder="Name" value={newItem.name} onChange={handleChange} /></td>
            <td><input type="text" name="description" placeholder="Description" value={newItem.description} onChange={handleChange} /></td>
            <td><input type="number" name="price" placeholder="Price" value={newItem.price} onChange={handleChange} /></td>
            <td><input type="text" name="urgency" placeholder="Urgency" value={newItem.urgency} onChange={handleChange} /></td>
            <td><button onClick={handleAddItem}>Add Item</button></td>
        </tr>
    );
};

export default AddItemRow;