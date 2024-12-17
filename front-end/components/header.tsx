import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {CgProfile} from "react-icons/cg";
import Language from './language/Language';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';

const Header: React.FC = () => {
    const [logedIn, setLogedIn] = useState<boolean>(false)

    const { t } = useTranslation("common");

    const router = useRouter();
    useEffect(() => {
        try {
            const userToken = localStorage.getItem("userLoginToken");
            if (!userToken) {
                setLogedIn(false);
            } else {
                setLogedIn(true);
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
                            <Link href="/">
                                <h3 className="text-white">{t("header.nav.home")}</h3>
                            </Link>
                            <Link href="/lists">
                                <h3 className="text-white">{t("header.nav.lists")}</h3>
                            </Link>
                            <Link href="/monthlySpendings">
                                <h3 className="text-white">{t("header.nav.monthly")}</h3>
                            </Link>
                        </div>
                        
                        <Language />
                        <div className="flex items-center space-x-4 text-white">
                                <h3 onClick={() => handleLogout()} className='cursor-pointer '>{t("header.nav.logout")}</h3>
                            <Link className="ProfileIcon text-white" href="/profile">
                                <CgProfile size={24} />
                            </Link>
                        </div>
                    </header>
                </nav>
            </div>)}
        </div>
    );
};

export default Header;
