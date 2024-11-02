import Profile from "../model/profile";
import profileDb from "../repository/profile.db";
import { ProfileInput as ProfileInput } from "../types";

const addProfile = (input: ProfileInput): Profile => {
    try {
        const existingProfile = profileDb.getProfileByEmail({ email: input.email });
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

const getProfileByEmail = (email: string): Profile | undefined => {
    const profile = profileDb.getProfileByEmail({ email });

    if (profile != undefined) {
        return profile;
    } else {
        throw new Error(`Profile with email ${email} does not exist.`);
    }
};

const getAllProfiles = (): Profile[] => {
    return profileDb.getAllProfiles();
};

const removeProfile = (email: string): void => {
    const profile = profileDb.getProfileByEmail({ email });

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