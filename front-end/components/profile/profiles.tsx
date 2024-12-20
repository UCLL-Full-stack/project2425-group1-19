import { fetchProfiles } from '@/service/profileService';
import React, { useEffect, useState } from 'react';
import { Profile } from '@/types';
import AddProfileForm from './addProfile';
import { useTranslation } from 'next-i18next';

const Profiles: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [refreshProfiles, setRefreshProfiles] = useState<boolean>(false);
    const { t } = useTranslation();

    const fetchData = async () => {
        try {
            const profiles = await fetchProfiles();
            setProfiles(profiles);
        } catch (error) {
            setError('Failed to fetch profiles');
        }
    };

    // Fetch profiles when the component mounts or when refreshProfiles is true
    useEffect(() => {
        fetchData();
        setRefreshProfiles(false); // Reset the refresh flag after fetching
    }, [refreshProfiles]); // Only trigger when refreshProfiles changes

    const handleProfileAdded = () => {
        setRefreshProfiles(true); // Set the flag to trigger profile refetching
    };

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">{t("profile.table.email")}</th>
                        <th className="py-2 px-4 border-b">{t("profile.table.Name")}</th>
                        <th className="py-2 px-4 border-b">{t("profile.table.LastName")}</th>
                        <th className="py-2 px-4 border-b">{t("profile.table.UserId")}</th>
                    </tr>
                </thead>
                <tbody>
                    {profiles.map((profile) => (
                        <tr key={profile.id}>
                            <td className="py-2 px-4 border-b">{profile.email}</td>
                            <td className="py-2 px-4 border-b">{profile.name}</td>
                            <td className="py-2 px-4 border-b">{profile.lastName}</td>
                            <td className="py-2 px-4 border-b">{profile.userId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AddProfileForm onProfileAdded={handleProfileAdded} />
        </div>
    );
};

export default Profiles;
