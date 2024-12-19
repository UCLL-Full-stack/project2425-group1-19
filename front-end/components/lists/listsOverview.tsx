import React, {useEffect, useState} from 'react';
import AddItemForm from './addItemForm';
import {getShoppingLists, addItemToShoppingList, addShoppingList, createCorrectItem} from '@/service/listsService';
import {ShoppingList, Item} from '@/types';
import {useTranslation} from 'next-i18next';
import ListDetail from './ListDetail';

const ListsOverview: React.FC = () => {
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [selectedListName, setSelectedListName] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const {t} = useTranslation();

    const fetchShoppingLists = async () => {
        try {
            const lists = await getShoppingLists();
            // console.log('Fetched lists:', lists); // Debugging: Log fetched lists
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

    const handleAddItem = async (item: Item, newListName?:string) => {
        console.log('Item added:', item);
        if (selectedListName && !newListName) {
            try {
                setErrorMessage(null);
                try {
                    await addItemToShoppingList(selectedListName, item);
                } catch (e) {
                    setErrorMessage(JSON.stringify(e));
                    return;
                }

                // Als backend cresht is dit duidelijk
                await fetchShoppingLists();

                // Zorgt voor refresh
                setRefreshKey((oldKey) => oldKey + 1);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage('An unexpected error occurred.');
                }
            }
        } else if(newListName) {
            console.log(`A new list "${newListName}" is trying to be created.`);
            try {
                await addShoppingList({ ListName: newListName, items: [createCorrectItem(item)] });
                setErrorMessage("");
                
                setSelectedListName(newListName);
                setRefreshKey((oldKey) => oldKey + 1);
            } catch (error) {
                setErrorMessage(JSON.stringify(error));
                return;
            }
        };
    };

    const handleRefreshAfterAction = async () => {
        try {
            await fetchShoppingLists()
        } catch (error) {
            setErrorMessage(JSON.stringify(error))
        }
    };

    // Responsive design needs improvments
    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-4'>{t("lists.overview")}</h1>
            <div className="overflow-x-auto">
                <table className='w-full border-collapse mt-5'>
                    <thead>
                        <tr>
                            <th className='border border-gray-300 p-2 text-left bg-gray-200'>{t("lists.table.name")}</th>
                            <th className='border border-gray-300 p-2 text-left bg-gray-200'>{t("lists.table.number")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shoppingLists.map((list) => (
                            <tr key={list.ListName} onClick={() => handleRowClick(list.ListName)} className="cursor-pointer hover:bg-gray-100 hover:underline">
                                <td className='border border-gray-300 p-2'>{list.ListName}</td>
                                <td className='border border-gray-300 p-2'>{list.items ? list.items.length : 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                {selectedListName && (
                    <>
                        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
                        <div className='flex flex-col items-center sm:justify-center ml-4'>
                            <div className="text-sm w-96 h-96 overflow-auto md:w-full md:h-auto md:text-lg">
                                {/* Key zorgt voor refreshes */}
                                <ListDetail key={refreshKey} onPurchase={handleRefreshAfterAction} shoppingListName={selectedListName} />
                            </div>

                            <AddItemForm onAddItem={handleAddItem} onNeedRefresh={handleRefreshAfterAction} shoppingListName={selectedListName} />
                        </div>
                    </>
                )}
            </div>
            <div>
                {!selectedListName && (
                    <>
                        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
                        <AddItemForm onAddItem={handleAddItem} onNeedRefresh={handleRefreshAfterAction} shoppingListName="" />
                    </>
                )}
            </div>
            {selectedListName && (
                <button type="button" onClick={()=>setSelectedListName('')}>
                    {t('lists.deselectList')}
                </button>)}
        </div>
    );
};

export default ListsOverview;
