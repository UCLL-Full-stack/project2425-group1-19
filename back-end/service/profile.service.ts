import { th } from "date-fns/locale";
import Profile from "../model/profile";
import profileDb from "../repository/profile.db";
import { ProfileInput as ProfileInput } from "../types";
import userService from "./user.service";
import userDb from "../repository/user.db";

const addProfile = async(input: ProfileInput): Promise<Profile> => {
        //const existingProfile = await profileDb.getProfileByEmail({ email: input.email });

       // if (existingProfile) {
       //     throw new Error(`Profile with email ${input.email} already exists.`);
        //}
        //Om zeker te zijn dat de item voldoet aan de regels
        const newProfile = Profile.from(input);
        return await profileDb.saveProfile(newProfile);
        
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

const getProfileByUserId = async(userId: number): Promise<Profile | undefined> => {
    try {
        const profile = await profileDb.getProfileByUserId(userId);
        if (profile) {
            return profile;
        } else {
            throw new Error(`Profile with userId ${userId} does not exist.`);
        }
    } catch (error) {

        throw new Error('service error');
    }


}


export default {
    addProfile,
    getProfileByEmail,
    getAllProfiles,
    removeProfile,
    getProfileByUserId
};