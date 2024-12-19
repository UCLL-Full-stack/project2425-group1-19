import { profile } from "console";
import Profile from "../model/profile";
import User from "../model/user";
import profileService from "../service/profile.service";
import database from "./database";

const saveProfile = async (profile: Profile): Promise<Profile> => {
    const savedProfile = await database.profile.create({
        data: {
            email: profile.getEmail(),
            name: profile.name,
            lastName: profile.lastName,
            userId: profile.userId,
        },
    });
    return new Profile(savedProfile);
};

const getProfileByEmail = async ({email}: {email: string}): Promise<Profile | null> => {
    try {
        const profile = await database.profile.findUnique({
            where: {email},
        });
        if (!profile) {
            throw new Error('No profile found with email:'+email)
        }
        return new Profile(profile);
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

const removeProfile = async (email: string): Promise<void> => {
    try {
        await database.profile.delete({
            where: {email},
        });
    } catch (error) {
        throw new Error(`Profile with email ${email} not found.`);
    }
};


const getProfileByUserId = async (userId: number): Promise<Profile | undefined> => {
    try {
        const profile = await database.profile.findUnique({
            where: {userId},
        });
        if (!profile) {
            throw new Error('No profile found with username:'+userId)
        }
        return Profile.from(profile);
    } catch (error) {
        throw new Error('db username');
    }
};

const getAllProfiles = async (): Promise<Array<Profile>> => {
    try {
        const profiles = await database.profile.findMany();
        const profile_array = profiles.map((p) => Profile.from(p))
        return profile_array;
    } catch (error) {
        throw new Error('database getall error');
    }
};

const createTestProfiles = async (): Promise<void> => {
    const profile1 = new Profile({ email: "Janneke@hotmail.com", name: "Jan", lastName: "Janssens", userId: 1 });
    const profile2 = new Profile({ email: "Jannineke@telenet.be", name: "Jannine", lastName: "Janssens", userId: 2 }) ;
    const profile3 = new Profile({ email: "Jeanke@outlook.com", name: "Jean", lastName: "Janssnes", userId: 3 });
    await saveProfile(profile1);
    await saveProfile(profile2);
    await saveProfile(profile3);
};
// createTestProfiles();

export default {
    saveProfile,
    getAllProfiles,
    removeProfile,
    getProfileByEmail,
    getProfileByUserId,
};
