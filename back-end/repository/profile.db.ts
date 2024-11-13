import Profile from "../model/profile";
import database from "./database";

const saveProfile = async (profile: Profile): Promise<Profile> => {
    const savedProfile = await database.profile.create({
        data: {
            email: profile.getEmail,
            name: profile.name,
            lastname: profile.lastname,
        },
    });
    return savedProfile;
};

const getProfileByEmail = async ({email}: {email: string}): Promise<Profile | null> => {
    try {
        const profile = await database.profile.findUnique({
            where: {email},
        });
        return profile;
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

const getAllProfiles = async (): Promise<Array<Profile>> => {
    const profiles = await database.profile.findMany();
    return profiles;
};

const createTestProfiles = (): void => {
    const profile1 = new Profile({email: "Janneke@hotmail.com", name: "Jan", lastname: "Janssens"});
    const profile2 = new Profile({email: "Jannineke@telenet.be", name: "Jannine", lastname: "Janssens"});
    const profile3 = new Profile({email: "Jeanke@outlook.com", name: "Jean", lastname: "Janssnes"});
    saveProfile(profile1);
    saveProfile(profile2);
    saveProfile(profile3);
};
// createTestProfiles();

export default {
    saveProfile,
    getAllProfiles,
    removeProfile,
    getProfileByEmail,

};
