import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import Head from 'next/head';
import Header from '@/components/header';
import {getShoppingList} from '@/service/listsService';
import ListDetail from '@/components/lists/ListDetail';
import {ShoppingList} from '@/types';

const ListPage: React.FC = () => {
    const router = useRouter();
    const {listName} = router.query;
    const [list, setList] = useState<ShoppingList | null>(null);

    useEffect(() => {
        if (listName) {
            const fetchShoppingList = async () => {
                const response = await getShoppingList(Array.isArray(listName) ? listName[0] : listName);
                const listData = await response
                setList(listData);
            };
            fetchShoppingList();
        }
    }, [listName]);

    if (!list) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Head>
                <title>{listName}'s list</title>
            </Head>
            <header>
                <nav>
                    <Header />
                </nav>
            </header>
            <main>
                <ListDetail shoppingListName={Array.isArray(listName) ? listName[0] : (listName || '')} />
            </main>
        </>
    );
};

export default ListPage;