import React, {useEffect, useState} from 'react';
import {getShoppingList, removeItemFromShoppingList, removeShoppingList} from '@/service/listsService';
import {ShoppingList, Urgency} from '@/types';
import {FaTrash} from 'react-icons/fa';
import {useTranslation} from 'next-i18next';

type Props = {
    onPurchase: () => void;
    shoppingListName: string
};

const ListDetail: React.FC<Props> = ({onPurchase, shoppingListName}: Props) => {
    const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
    const { t } = useTranslation();

    const getUrgencyClass = (urgency: Urgency) => {
        switch (urgency) {
            case 'low':
                return 'bg-green-100';
            case 'mid':
                return 'bg-yellow-100';
            case 'high':
                return 'bg-red-100';
            default:
                return '';
        }
    };

    const fetchShoppingList = async () => {
        try {
            const list:ShoppingList = await getShoppingList(shoppingListName);
            console.log('Fetched shopping list:', list);
            setShoppingList(list);
        } catch (error) {
            console.error(error);
            window.location.reload();
        }
    };

    useEffect(() => {
        fetchShoppingList();
    }, [shoppingListName]);

    const handlePurchase = async (itemName: string) => {
        try {
            await removeItemFromShoppingList(shoppingListName, itemName);
            setShoppingList((prevList) => {
                if (!prevList) return prevList;
                return {
                    ...prevList,
                    items: prevList.items ? prevList.items.filter(item => item.name !== itemName) : []
                };
            });
            await fetchShoppingList();
            await onPurchase();
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteList = async () => {
        const confirmation = window.confirm("Are you sure you want to delete: " + shoppingList?.ListName);
        if (confirmation && shoppingList) {
            removeShoppingList(shoppingList?.ListName)
            console.log("List deleted: " + shoppingList?.ListName);
            fetchShoppingList();
        }
    }

    if (!shoppingList) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center p-4">
            <div className='flex flex-row items-center gap-6 mb-4'>
                <h1 className="text-2xl font-bold">{shoppingList.ListName}</h1>
                <div
                    className='text-red-500'
                    onClick={async () => await handleDeleteList()}>
                    <FaTrash className='h-4 w-4'/>
                </div>
            </div>
            <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="px-2 py-1 sm:px-2 sm:py-1 border border-gray-300 bg-gray-200">{t("lists.list.itemname")}</th>
                            <th className="px-2 py-1 sm:px-2 sm:py-1 border border-gray-300 bg-gray-200">{t("lists.list.description")}</th>
                            <th className="px-2 py-1 sm:px-2 sm:py-1 border border-gray-300 bg-gray-200">{t("lists.list.price")}</th>
                            <th className="px-2 py-1 sm:px-2 sm:py-1 border border-gray-300 bg-gray-200">{t("lists.list.urgency")}</th>
                            <th className="px-2 py-1 sm:px-4 sm:py-2 border border-gray-300 bg-gray-200 ">{t("lists.list.Action")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shoppingList.items && shoppingList.items.map((item) => (
                            <tr key={item.name} className={`border-t-2 ${getUrgencyClass(item.urgency || 'low')}`}>
                                <td className="px-2 py-1 sm:px-2 sm:py-1 border border-gray-300">{item.name}</td>
                                <td className="px-2 py-1 sm:px-2 sm:py-1 border border-gray-300">{item.description}</td>
                                <td className="px-2 py-1 sm:px-2 sm:py-1 border border-gray-300">{item.price}</td>
                                <td className="px-2 py-1 sm:px-2 sm:py-1 border border-gray-300">{item.urgency}</td>
                                <td className="px-2 py-1 sm:px-2 sm:py-1 border border-gray-300">
                                    <button onClick={() => item.name && handlePurchase(item.name)}>{t("lists.list.buy")}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListDetail;
