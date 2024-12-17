import Header from "@/components/header";
import Head from "next/head";
import {useRouter} from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import React, {useEffect} from "react";

const monthlySpendings: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

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

export const getServerSideProps = async (context: { locale: any; }) => {
  return {
      props: {
          ...(await serverSideTranslations(context.locale ?? "en", ["common"]) ),
      },
  };
}

export default monthlySpendings;