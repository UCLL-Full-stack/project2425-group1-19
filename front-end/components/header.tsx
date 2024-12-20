import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {CgProfile} from "react-icons/cg";
import { FaBars } from 'react-icons/fa';
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
            localStorage.removeItem("userId");
            setLogedIn(false);
            router.push('/');
        }
    }



    return (
        <div>{logedIn && (
            <div className='w-screen mb-6'>
                <nav className="bg-gray-800 p-4">
                    <header className="flex justify-between items-center">
                        <div className="flex space-x-2 items-center">
                            <div className="sm:hidden">
                            <div
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-white focus:outline-none bg-transparent border-none"
                            >
                                <FaBars className="w-4 h-4" />
                            </div>
                            </div>
                            <div className={`sm:flex ${isMenuOpen ? 'block' : 'hidden'} sm:space-x-4`}>
                                <Link href="/">
                                    <h3 className="text-white mb-4">{t("header.nav.home")}</h3>
                                </Link>
                                <Link href="/lists">
                                    <h3 className="text-white mb-4">{t("header.nav.lists")}</h3>
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
