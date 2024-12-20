import Header from "@/components/header";
import Head from "next/head";
import {useRouter} from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import React, {useEffect, useState} from "react";
import ProfileOverview from "@/components/profile/profileOverview";
import UserService from "@/service/userService";

const Profile: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [id, setId] = useState<number>(0);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userToken = localStorage.getItem("userLoginToken");
        if (!userToken) {
          router.push("/login");
        }
        const username = localStorage.getItem("username");
        
        setId(await UserService.getUserId(username || ""));
      } catch (error) {
        console.error("An error occurred while retrieving the user token:", error);
        router.push("/login");
      }
    };

    fetchUserId();
  }, [router]);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Header />
      <main>
        <ProfileOverview userId={id} />
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

export default Profile;