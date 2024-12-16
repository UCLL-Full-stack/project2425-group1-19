import { AuthenticationResponse } from "@/types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const loginUser = async (username:string, password:string): Promise<AuthenticationResponse> => {
    try {
        const response = await fetch(apiUrl+'/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });
        if (!response.ok) {
            throw new Error(`Login failed:${response}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
};


export default {
    loginUser,

    };