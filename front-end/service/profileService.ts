import {AuthenticationResponse, Item} from "@/types";
import userService from "./userService";
const backendUrl = process.env.NEXT_PUBLIC_API_URL;

if (!backendUrl) {
    throw new Error('Backend URL is not defined in the environment variables');
}

const getProfile = async () => {
    const token:AuthenticationResponse = userService.getLocalStorageFields();
    const id = await userService.getUserId(token.username);

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

export {
    getProfile,


};