import Header from "@/components/header";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import {useRouter} from "next/router";
import React, {useEffect} from "react";
import { useTranslation } from "react-i18next";

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
        <title>{t("monthly.title")}</title>
      </Head>
      <Header />
      <main>
        <h1>{t("monthly.description")}</h1>
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