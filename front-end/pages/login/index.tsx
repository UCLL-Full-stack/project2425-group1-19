import Header from "@/components/header";
import userService from "@/service/userService";
import Head from "next/head";
import React, {useState} from 'react';
import {useRouter} from 'next/router';
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Login: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [feedbackName, setFeedbackName] = useState<string | null>(null);
    const [feedbackPass, setFeedbackPass] = useState<string | null>(null);

    const { t } = useTranslation();

    const router = useRouter();

    const restFeedback = () => {
        setFeedback("");
        setFeedbackName("");
        setFeedbackPass("");
    }

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        restFeedback();

        if (!username && !password) {
            setFeedbackName("Error");
            setFeedbackPass("Error");
            return;
        };

        if (!username) {
            setFeedbackName("Error");
            return;
        } else if (!password) {
            setFeedbackPass("Password");
            return;
        }
        else {
            try {
                const response = await userService.loginUser(username,password);
                if (response) {
                    setFeedback("success");
                    localStorage.setItem("userLoginToken", response.token);
                    localStorage.setItem("role", response.role);
                    localStorage.setItem("username", response.username);

                    setTimeout(() => {
                        router.push("/")
                    }, 800);
                }
            } catch (error) {
                setFeedback("failed");
                console.log("Login error:"+error)
            }
        }
    };

    return (
        <>
            <Head>
                <title>{t("login.title")}</title>
            </Head>
            <Header />

            <h1 className="text-3xl font-bold">{t("login.title")}</h1>
            {feedback && (<div>
                {feedback.toLowerCase().includes("success") ? (
                    <div>
                        <h3 className=" rounded-md text-green-300">{t("login.success")}</h3>
                    </div>
                ) : (
                    <div>
                        <h3 className=" rounded-md text-red-300">{t("login.failed")}</h3>
                    </div>
                )}
            </div>)}
            <div className="flex flex-col items-center mt-10 mb-4">
                <label htmlFor="username">{t("login.label.username")}</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder={t("login.username")}
                    className="max-w-40 rounded-md text-left px-2"
                    onChange={(e) => setUsername(e.target.value)}
                />
                {feedbackName && <span className="text-red-500">{t("login.validate.username")}</span>}
            </div>
            <div className="flex flex-col items-center mb-4">
                <label htmlFor="password">{t("login.label.password")}</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder={t("login.password")}
                    className="max-w-40 rounded-md text-left px-2"
                    onChange={(e) => setPassword(e.target.value)}
                />
                {feedbackPass && <span className="text-red-500">{t("login.validate.password")}</span>}
            </div>
            <div>
                <button type="submit" onClick={(e) => handleLogin(e)}>
                    {t("login.submit")}
                </button>
            </div>

            <div className="mt-4">
                <h1 className="text-2xl font-bold mb-4">User Table</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Username</th>
                                <th className="py-2 px-4 border-b">Password</th>
                                <th className="py-2 px-4 border-b">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2 px-4 border-b">admin</td>
                                <td className="py-2 px-4 border-b">Admin123!</td>
                                <td className="py-2 px-4 border-b">admin</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b">johndoe</td>
                                <td className="py-2 px-4 border-b">Password123!</td>
                                <td className="py-2 px-4 border-b">adult</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b">janedoe</td>
                                <td className="py-2 px-4 border-b">Password123!</td>
                                <td className="py-2 px-4 border-b">child</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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

export default Login;