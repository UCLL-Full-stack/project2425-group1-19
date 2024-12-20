import { Profile } from '@/types';
import React, { useEffect, useState } from 'react';
import { getProfile } from '@/service/profileService';


const ProfileOverview: React.FC<{ userId: number }> = ({ userId }) => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
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
            <h1 className="text-2xl font-bold mb-4">Profile Overview</h1>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Last Name:</strong> {profile.lastName}</p>
            <p><strong>User ID:</strong> {profile.userId}</p>
        </div>
    );
};

export default ProfileOverview;