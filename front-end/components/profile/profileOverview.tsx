import { Profile } from '@/types';
import React, { useEffect, useState } from 'react';
import { getProfile } from '@/service/profileService';
import { useTranslation } from 'next-i18next';


const ProfileOverview: React.FC<{ userId: number }> = ({ userId }) => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();
    
    const fetchProfile = async () => {
        try {
            const pro = await getProfile();
            setProfile(pro);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
            fetchProfile();
        }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!profile) {
        return <div>No profile found</div>; 
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">{t("profile.overview")}</h1>
            <p><strong>{t("profile.table.email")}:</strong> {profile.email}</p>
            <p><strong>{t("profile.table.Name")}:</strong> {profile.name}</p>
            <p><strong>{t("profile.table.LastName")}:</strong> {profile.lastName}</p>
            <p><strong>{t("profile.table.UserId")}:</strong> {profile.userId}</p>
        </div>
    );
};

export default ProfileOverview;