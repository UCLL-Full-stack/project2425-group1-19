import { fetchProfiles } from '@/service/profileService';
import React, { useEffect, useState } from 'react';
import { Profile } from '@/types';

const Profiles: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profiles = await fetchProfiles();
                setProfiles(profiles);
            } catch (error) {
                setError('Failed to fetch profiles');
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Last Name</th>
                        <th className="py-2 px-4 border-b">User ID</th>
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
        </div>
    );
};

export default Profiles;