import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/header';
import ListDetail from '@/components/lists/ListDetail';
import AddItemForm from '@/components/lists/addItemForm';
import { getShoppingList, addItemToShoppingList, createCorrectItem } from '@/service/listsService';
import { ShoppingList, Item } from '@/types';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const ListPage: React.FC = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const { listName } = router.query;
    const [list, setList] = useState<ShoppingList | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        try {
            const userToken = localStorage.getItem("userLoginToken");
            if (!userToken) {
                router.push("/login");
            }
        } catch (error) {
            console.error("An error occurred while retrieving the user token:", error);
            router.push("/login");
        }
    }, [router]);

    useEffect(() => {
        if (listName) {
            const fetchShoppingList = async () => {
                try {
                    const response = await getShoppingList(Array.isArray(listName) ? listName[0] : listName);
                    setList(response);
                } catch (error) {
                    console.error("Failed to fetch shopping list:", error);
                }
            };
            fetchShoppingList();
        }
    }, [listName]);

    const handleAddItem = async (item: Item) => {
        if (listName) {
            try {
                setErrorMessage(null);
                await addItemToShoppingList(Array.isArray(listName) ? listName[0] : listName, item);
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

    const handleRefreshAfterAction = async () => {
        if (listName) {
            try {
                const response = await getShoppingList(Array.isArray(listName) ? listName[0] : listName);
                setList(response);
            } catch (error) {
                setErrorMessage(JSON.stringify(error));
            }
        }
    };

    return (
        <>
            <Head>
                <title>{listName ? `${listName}'s list` : t("lists.title")}</title>
            </Head>
            <Header />
            <main>
                {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
                {list ? (
                    <>
                        <ListDetail key={refreshKey} onPurchase={handleRefreshAfterAction} shoppingListName={Array.isArray(listName) ? listName[0] : (listName || '')} />
                        <AddItemForm onAddItem={handleAddItem} onNeedRefresh={handleRefreshAfterAction} shoppingListName={Array.isArray(listName) ? listName[0] : (listName || '')} />
                    </>
                ) : (
                    <p>{t("lists.loading")}</p>
                )}
            </main>
        </>
    );
};

export const getServerSideProps = async (context: { locale: any; }) => {
    return {
        props: {
            ...(await serverSideTranslations(context.locale ?? "en", ["common"])),
        },
    };
};

export default ListPage;