import React, {useEffect, useState} from 'react';
import AddItemRow from './addItemRow';
import {getShoppingLists, addItemToShoppingList} from '@/service/listsService';
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

    const handleAddItem = async (item: Item) => {
        console.log('Item added:', item);
        if (selectedListName) {
            try {
                setErrorMessage(null);
                try {
                    await addItemToShoppingList(selectedListName, item);
                } catch (e) {
                    setErrorMessage(JSON.stringify(e));
                    return;
                }

                // Als backend cresht is dit duidelijk
                fetchShoppingLists();
                // Zorgt voor refresh
                setRefreshKey((oldKey) => oldKey + 1);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage('An unexpected error occurred.');
                }
            }
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
                                <ListDetail key={refreshKey} shoppingListName={selectedListName} />
                            </div>

                            <AddItemRow onAddItem={handleAddItem} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ListsOverview;
