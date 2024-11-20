import Profile from "../model/profile";
import profileDb from "../repository/profile.db";
import { ProfileInput as ProfileInput } from "../types";

const addProfile = async(input: ProfileInput): Promise<Profile> => {
    try {
        const existingProfile = await profileDb.getProfileByEmail({ email: input.email });
        if (existingProfile) {
            throw new Error(`Profile with email ${input.email} already exists.`);
        }
        //Om zeker te zijn dat de item voldoet aan de regels
        const newProfile = new Profile(input);
        return profileDb.saveProfile(newProfile);
    } catch (error) {
        throw new Error(`Profile with email ${input.email} already exists.`)
    }
        
};

const getProfileByEmail = async(email: string): Promise<Profile | undefined> => {
    const profile = await profileDb.getProfileByEmail({ email });

    if (profile != undefined) {
        return profile;
    } else {
        throw new Error(`Profile with email ${email} does not exist.`);
    }
};

const getAllProfiles = async(): Promise<Profile[]> => {
    return await profileDb.getAllProfiles();
};

const removeProfile = async(email: string): Promise<void> => {
    const profile = await profileDb.getProfileByEmail({ email });

    if (profile != undefined) {
        profileDb.removeProfile(email);
    } else {
        throw new Error(`Profile with email ${email} does not exist.`);
    }
};


export default {
    addProfile,
    getProfileByEmail,
    getAllProfiles,
    removeProfile,
};