import React, {useEffect, useState} from 'react';
import AddItemRow from './addItemRow';
import {getShoppingLists, addItemToShoppingList} from '@/service/listsService';
import {ShoppingList, Item} from '@/types';
import ListDetail from './ListDetail';

const ListsOverview: React.FC = () => {
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [selectedListName, setSelectedListName] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        //console.log(`Row clicked: ${listName}`);
        setSelectedListName(listName);
        setErrorMessage(null);
        fetchShoppingLists();
    };

    const handleAddItem = async (item: Item) => {
        console.log('Item added:', item);
        // Logic
        if (selectedListName) {
            try {
                await addItemToShoppingList(selectedListName, item);
                fetchShoppingLists();
                setErrorMessage(null);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage('An unexpected error occurred.');
                }
            }
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
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <ListDetail shoppingListName={selectedListName} />
                    <h3>Add an Item to the shoppingList</h3>
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
