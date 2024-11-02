import React, { useEffect, useState } from 'react';
import { getShoppingList, removeItemFromShoppingList } from '@/service/listsService';
import { ShoppingList } from '@/types';

type Props = {
    shoppingListName: string
};

const ListDetail: React.FC<Props> = ({shoppingListName }: Props) => {
    const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);

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
                    items: prevList.items.filter(item => item.name !== itemName)
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
        <div>
            <h1>{shoppingList.ListName}</h1>
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
                    {shoppingList.items.map((item) => (
                        <tr key={item.name}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.price}</td>
                            <td>{item.urgency}</td>
                            <td><button onClick={() => handlePurchase(item.name)}>Buy</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListDetail;
