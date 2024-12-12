import React, {useEffect} from 'react';
import Header from '@/components/header';
import Head from 'next/head';
import ListsOverview from '@/components/lists/listsOverview';
import {useRouter} from 'next/router';

const Lists: React.FC = () => {
  const router = useRouter();

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

  return (
    <>
      <Head>
        <title>Grocery lists</title>
      </Head>
      <Header />
      <h1>Lists Page</h1>
      <p>This is the lists page.</p>
      <div>
        <ListsOverview />
      </div>
    </>
  )
};

export default Lists;