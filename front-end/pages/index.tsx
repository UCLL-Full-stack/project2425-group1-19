import React, {useEffect} from "react";
import Header from "@/components/header";
import Head from "next/head";
import {useRouter} from 'next/router';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Home: React.FC = () => {
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
        <title>{t("home.title")}</title>
      </Head>
      <Header />

      <main>
        <h1>{t("home.subtitle")}</h1>
        <h2>{t("home.description")}</h2>
      </main>
    </>
  );
}

export const getServerSideProps = async (context: { locale: any; }) => {
  return {
      props: {
          ...(await serverSideTranslations(context.locale ?? "en", ["common"]) ),
      },
  };
}

export default Home
