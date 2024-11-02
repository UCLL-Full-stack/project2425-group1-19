import React from 'react';
import Header from '@/components/header';
import Head from 'next/head';
import ListsOverview from '@/components/lists/listsOverview';

const Lists: React.FC = () => {
    return (
        <>
            <Head>
                <title>Grocery lists</title>
            </Head>
            <header>
                <nav>
                    <Header />
                </nav>
            </header>
            <h1>Lists Page</h1>
            <p>This is the lists page.</p>
            <div>
                <ListsOverview/>
            </div>
        </>
    )
};

export default Lists;