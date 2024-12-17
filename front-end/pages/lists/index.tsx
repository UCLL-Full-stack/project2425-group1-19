import React, {useEffect} from 'react';
import Header from '@/components/header';
import Head from 'next/head';
import ListsOverview from '@/components/lists/listsOverview';
import {useRouter} from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const Lists: React.FC = () => {
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
        <title>{t("lists.title")}</title>
      </Head>
      <Header />
      <h1>{t("lists.title")}</h1>
      <p>{t("lists.description")}</p>
      <div>
        <ListsOverview />
      </div>
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

export default Lists;