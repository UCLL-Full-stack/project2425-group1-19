import {AuthenticationResponse, Item} from "@/types";
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

export {
    getProfile,
    fetchProfiles,

};