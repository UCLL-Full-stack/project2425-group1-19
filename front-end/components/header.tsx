import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {CgProfile} from "react-icons/cg";
import Language from './language/Language';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';

const Header: React.FC = () => {
    const [logedIn, setLogedIn] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [username, setUsername] = useState<String>("");
    const {t} = useTranslation("common");

    const router = useRouter();
    useEffect(() => {
        try {
            const userToken = localStorage.getItem("userLoginToken");
            if (!userToken) {
                setLogedIn(false);
            } else {
                setLogedIn(true);
                setUsername(localStorage.getItem("username") || "user")
            };
        } catch (error) {
            setLogedIn(false);
        }
    }, [router]);

    const handleLogout = () => {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("userLoginToken");
            setLogedIn(false);
            router.push('/');
        }
    }



    return (
        <div>{logedIn && (
            <div className='w-screen mb-6'>
                <nav className="bg-gray-800 p-4">
                    <header className="flex justify-between items-center">
                        <div className="flex space-x-8">
                            <div className="sm:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="text-white focus:outline-none"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16m-7 6h7"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                            <div className={`sm:flex ${isMenuOpen ? 'block' : 'hidden'} sm:space-x-8`}>
                                <Link href="/">
                                    <h3 className="text-white mb-4">{t("header.nav.home")}</h3>
                                </Link>
                                <Link href="/lists">
                                    <h3 className="text-white mb-4">{t("header.nav.lists")}</h3>
                                </Link>
                                <Link href="/monthlySpendings">
                                    <h3 className="text-white mb-4">{t("header.nav.monthly")}</h3>
                                </Link>
                            </div>
                        </div>
                        <Language />
                        <div className="flex items-center space-x-4 text-white text-center">
                            <h3 onClick={() => handleLogout()} className='cursor-pointer'>{t("header.nav.logout")}</h3>

                            <Link className="ProfileIcon text-white flex flex-col items-center" href="/profile">
                                <CgProfile size={24} />
                                <h3 className='mt-2 text-sm'>{username}</h3>
                            </Link>
                        </div>
                    </header>
                </nav>
            </div>)}
        </div>
    );
};

export default Header;
