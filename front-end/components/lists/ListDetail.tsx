import React, { useEffect, useState } from 'react';
import { getShoppingList, removeItemFromShoppingList } from '@/service/listsService';
import { ShoppingList, Urgency } from '@/types';

type Props = {
    shoppingListName: string
};

const ListDetail: React.FC<Props> = ({shoppingListName }: Props) => {
    const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
    
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

    useEffect(() => {
        const fetchShoppingList = async () => {
            try {
                const list = await getShoppingList(shoppingListName);
                setShoppingList(list);
            } catch (error) {
                console.error(error);
            }
        };

        fetchShoppingList();
    }, [shoppingListName]);

    const handlePurchase = async (itemName: string) => {
        try {
            await removeItemFromShoppingList(shoppingListName, itemName);
            // Update the state to remove the item from the list
            setShoppingList((prevList) => {
                if (!prevList) return prevList;
                return {
                    ...prevList,
                    items: prevList.items ? prevList.items.filter(item => item.name !== itemName) : []
                };
            });
        } catch (error) {
            console.error(error);
        }
    }

    if (!shoppingList) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-4">{shoppingList.ListName}</h1>
            <div className="overflow-x-auto w-full">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border border-gray-300 bg-gray-200">Item Name</th>
                            <th className="px-4 py-2 border border-gray-300 bg-gray-200">Description</th>
                            <th className="px-4 py-2 border border-gray-300 bg-gray-200">Price</th>
                            <th className="px-4 py-2 border border-gray-300 bg-gray-200">Urgency</th>
                            <th className="px-4 py-2 border border-gray-300 bg-gray-200">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shoppingList.items && shoppingList.items.map((item) => (
                            <tr key={item.name} className={`border-t-2 ${getUrgencyClass(item.urgency || 'low')}`}>
                                <td className="px-4 py-2 border border-gray-300">{item.name}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.description}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.price}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.urgency}</td>
                                <td className="px-4 py-2 border border-gray-300">
                                    <button onClick={() => item.name && handlePurchase(item.name)}>Buy</button>
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
