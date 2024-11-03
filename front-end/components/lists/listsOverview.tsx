import React, { useEffect, useState } from 'react';
import AddItemRow from './addItemRow';
import { getShoppingLists, addItemToShoppingList} from '@/service/listsService';
import { ShoppingList, Item } from '@/types';
import ListDetail from './ListDetail';

const ListsOverview: React.FC = () => {
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [selectedListName, setSelectedListName] = useState<string | null>(null);

    const fetchShoppingLists = async () => {
        try {
            const lists = await getShoppingLists();
            //console.log('Fetched lists:', lists); // Debugging: Log fetched lists
            setShoppingLists(lists);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchShoppingLists();
    }, []);

    const handleRowClick = (listName: string) => {
        console.log(`Row clicked: ${listName}`);
        setSelectedListName(listName);
    };

    const handleAddItem = (item: Item) => {
        console.log('Item added:', item);
        // Logic
        if (selectedListName) {
        addItemToShoppingList(selectedListName, item);
    }
    };

    return (
        <div>
            <h1>Shopping Lists Overview</h1>
            <table>
                <thead>
                    <tr>
                        <th>List Name</th>
                        <th>Number of Items</th>
                    </tr>
                </thead>
                <tbody>
                    {shoppingLists.map((list) => (
                        <tr key={list.ListName} onClick={() => handleRowClick(list.ListName)}>
                            <td>{list.ListName}</td>
                            <td>{list.items.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedListName && (
                <>
                    <ListDetail shoppingListName={selectedListName} />
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Urgency</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AddItemRow onAddItem={handleAddItem} />
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default ListsOverview;
