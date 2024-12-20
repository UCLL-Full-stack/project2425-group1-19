import {AuthenticationResponse, Item, Profile} from "@/types";
import userService from "./userService";
const backendUrl = process.env.NEXT_PUBLIC_API_URL;

if (!backendUrl) {
    throw new Error('Backend URL is not defined in the environment variables');
}

const getProfile = async () => {
    const token:AuthenticationResponse = userService.getLocalStorageFields();
    const id = await userService.getUserId(token.username);
    localStorage.setItem('userId', id.toString());

    const response = await fetch(`${backendUrl}/profile/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token.token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch profile');
    }
    return response.json();
};

const fetchProfiles = async () => {
    try {
        const token:AuthenticationResponse = userService.getLocalStorageFields();

        const response = await fetch('http://localhost:3000/profile', {
            headers: {
                
                'Authorization': `Bearer ${token.token}`,
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('An error occurred:', err);
    }
};

const addProfile = async (profile: Profile) => {
    try {
        const token: AuthenticationResponse = userService.getLocalStorageFields();

        const response = await fetch(`${backendUrl}/profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.token}`,
            },
            body: JSON.stringify(profile),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.message || 'Failed to add profile');
        }

        return response.json();
    } catch (err) {
        console.error('An error occurred while adding profile:', err);
        throw err;
    }
};

export const addUser = async (user: { username: string; password: string; id: number; role: string }) => {
    const token: AuthenticationResponse = userService.getLocalStorageFields();
    const response = await fetch(`${backendUrl}/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token.token}`,
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error('Failed to add user');
    }

    return await response.json();
};


export {
    getProfile,
    fetchProfiles,
    addProfile,

};