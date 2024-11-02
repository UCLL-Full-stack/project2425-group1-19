import React from 'react';
import Link from 'next/link';
import {CgProfile} from "react-icons/cg";

const Header: React.FC = () => {
    return (
        <nav>
            <header>
                <Link
                    href="/">
                    <h3>Home</h3>
                </Link>
                <Link
                    href="/lists">
                    <h3>Lists</h3>
                </Link>
                <Link
                    href="/monthlySpendings">
                    <h3>Monthly spendings</h3>
                </Link>
                <Link className='ProfileIcon'
                    href="/profile">
                    <CgProfile />
                </Link>
            </header>
        </nav>
    );
};

export default Header;
