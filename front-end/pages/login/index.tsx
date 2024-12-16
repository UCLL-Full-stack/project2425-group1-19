import Header from "@/components/header";
import userService from "@/service/userService";
import Head from "next/head";
import React, {useState} from 'react';
import {useRouter} from 'next/router';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [feedbackName, setFeedbackName] = useState<string | null>(null);
    const [feedbackPass, setFeedbackPass] = useState<string | null>(null);

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
                    setFeedback("success: Redirecting to homepage");
                    localStorage.setItem("userLoginToken", response.token);
                    localStorage.setItem("role", response.role);
                    localStorage.setItem("username", response.username);

                    setTimeout(() => {
                        router.push("/")
                    }, 800);
                }
            } catch (error) {
                setFeedback("Login failed")
                console.log("Login error:"+error)
            }
        }
    };

    return (
        <>
            <Head>
                <title>Home page</title>
            </Head>
            <Header />

            <h1 className="text-3xl font-bold">Login</h1>
            {feedback && (<div>
                {feedback.toLowerCase().includes("success") ? (
                    <div>
                        <h3 className=" rounded-md text-green-300">Login succeeded</h3>
                    </div>
                ) : (
                    <div>
                        <h3 className=" rounded-md text-red-300">Login failed</h3>
                    </div>
                )}
            </div>)}
            <div className="flex flex-col items-center mt-10 mb-4">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    className="max-w-40 rounded-md text-left px-2"
                    onChange={(e) => setUsername(e.target.value)}
                />
                {feedbackName && <span className="text-red-500">Name is required</span>}
            </div>
            <div className="flex flex-col items-center mb-4">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    className="max-w-40 rounded-md text-left px-2"
                    onChange={(e) => setPassword(e.target.value)}
                />
                {feedbackPass && <span className="text-red-500">Password is required</span>}
            </div>
            <div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={(e) => handleLogin(e)}>
                    Login
                </button>
            </div>

        </>
    )
};

export default Login;