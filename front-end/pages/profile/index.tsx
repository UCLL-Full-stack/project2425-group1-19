import Header from "@/components/header";
import Head from "next/head";
import {useRouter} from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import React, {useEffect, useState} from "react";
import ProfileOverview from "@/components/profile/profileOverview";
import Profiles from "@/components/profile/profiles";
import UserService from "@/service/userService";
import { AuthenticationResponse, Item } from "@/types";
import userService from "@/service/userService";
import AddProfile from "@/components/profile/addProfile";

const Profile: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [id, setId] = useState<number>(0);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userToken = localStorage.getItem("userLoginToken");
        if (!userToken) {
          router.push("/login");
        }
        const username = localStorage.getItem("username");
        setRole(userService.getLocalStorageFields().role);
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
        <title>{t("profile.title")}</title>
      </Head>
      <Header />
      <main>
        {role === "admin" && (
          <Profiles />
        )}
        
        {role !== "admin" && (<ProfileOverview userId={id} />)}
        
        
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