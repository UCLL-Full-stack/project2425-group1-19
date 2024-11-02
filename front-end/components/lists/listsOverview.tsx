import React, { useEffect, useState } from 'react';
import { getShoppingLists } from '@/service/listsService';
import { ShoppingList } from '@/types';
import ListDetail from './ListDetail';

const ListsOverview: React.FC = () => {
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [selectedListName, setSelectedListName] = useState<string | null>(null);

    useEffect(() => {
        const fetchShoppingLists = async () => {
            try {
                const lists = await getShoppingLists();
                console.log('Fetched lists:', lists); // Debugging: Log fetched lists
                setShoppingLists(lists);
            } catch (error) {
                console.error(error);
            }
        };

        fetchShoppingLists();
    }, []);

    const handleRowClick = (listName: string) => {
        console.log(`Row clicked: ${listName}`);
        setSelectedListName(listName);
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
            {selectedListName && <ListDetail shoppingListName={selectedListName}/>}
        </div>
    );
};

export default ListsOverview;
