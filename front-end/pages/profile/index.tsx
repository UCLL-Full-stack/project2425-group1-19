import Header from "@/components/header";
import Head from "next/head";
import {useRouter} from "next/router";
import React, {useEffect} from "react";

const monthlySpendings: React.FC = () => {
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
        <title>Profile</title>
      </Head>
      <Header />
      <main>
        <h1>Under development</h1>
      </main>
    </>
  )
};

export default monthlySpendings;