import Profile from "../model/profile";
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

const getAllProfiles = async (): Promise<Array<Profile>> => {
    const profiles = await database.profile.findMany();
    const profile_array = profiles.map((p) => new Profile(p))
    return profile_array;
};

const createTestProfiles = async (): Promise<void> => {
    const profile1 = new Profile({ email: "Janneke@hotmail.com", name: "Jan", lastName: "Janssens", userId: 1 });
    const profile2 = new Profile({ email: "Jannineke@telenet.be", name: "Jannine", lastName: "Janssens", userId: 2 });
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

};
