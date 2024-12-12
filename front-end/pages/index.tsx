import React, {useEffect} from "react";
import Header from "@/components/header";
import Head from "next/head";
import {useRouter} from 'next/router';

const Home: React.FC = () => {
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
        <title>Home page</title>
      </Head>
      <Header />

      <main>
        <h1>Welcom to your Grocery management x app </h1>
        <h2>Manage your shopping lists and know what you need to buy</h2>
      </main>
    </>
  );
}

export default Home
