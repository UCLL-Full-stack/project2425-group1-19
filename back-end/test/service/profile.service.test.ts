import ProfileService from "../../service/profile.service";
import profileDb from "../../repository/profile.db";
import Profile from "../../model/profile";
import { ProfileInput } from "../../types";

// Sample profile inputs
const profileInput1: ProfileInput = { email: "john.doe@example.com", name: "John", lastName: "Doe", userId: 1 };
const profileInput2: ProfileInput = { email: "jane.doe@example.com", name: "Jane", lastName: "Doe", userId: 2 };
const profileInput3: ProfileInput = { email: "mark.smith@example.com", name: "Mark", lastName: "Smith", userId: 3 };

const profile1 = new Profile(profileInput1);
const profile2 = new Profile(profileInput2);
const profile3 = new Profile(profileInput3);

// Mocking the profile database
jest.mock("../../repository/profile.db");

const mockSaveProfile = profileDb.saveProfile as jest.Mock;
const mockGetProfileByEmail = profileDb.getProfileByEmail as jest.Mock;
const mockRemoveProfile = profileDb.removeProfile as jest.Mock;
const mockGetAllProfiles = profileDb.getAllProfiles as jest.Mock;

beforeEach(() => {
    jest.clearAllMocks();
});

test('given valid profile input; when adding a profile; then it should add the profile correctly', async () => {
    // given
    mockGetProfileByEmail.mockResolvedValue(null);
    mockSaveProfile.mockResolvedValue(profile1);

    // when
    const addedProfile = await ProfileService.addProfile(profileInput1);

    // then
    expect(addedProfile.getEmail()).toBe(profileInput1.email);
    expect(mockSaveProfile).toHaveBeenCalledWith(expect.any(Profile));
});

test('given existing email; when adding a profile; then it should throw an error', async () => {
    // given
    mockGetProfileByEmail.mockResolvedValue(profile1);

    // when & then
    await expect(ProfileService.addProfile(profileInput1)).rejects.toThrow(`Profile with email ${profileInput1.email} already exists.`);
});

test('given valid email; when retrieving a profile; then it should return the profile', async () => {
    // given
    mockGetProfileByEmail.mockResolvedValue(profile1);

    // when
    const retrievedProfile = await ProfileService.getProfileByEmail(profileInput1.email);

    // then
    expect(retrievedProfile).toBeDefined();
    expect(retrievedProfile?.getEmail()).toBe(profileInput1.email);
    expect(mockGetProfileByEmail).toHaveBeenCalledWith({ email: profileInput1.email });
});

test('given non-existing email; when retrieving a profile; then it should throw an error', async () => {
    // given
    const nonExistingEmail = "non_existing_email@example.com";
    mockGetProfileByEmail.mockResolvedValue(null);

    // when & then
    await expect(ProfileService.getProfileByEmail(nonExistingEmail)).rejects.toThrow(`Profile with email ${nonExistingEmail} does not exist.`);
});

test('given valid email; when removing a profile; then it should remove the profile', async () => {
    // given
    mockGetProfileByEmail.mockResolvedValue(profile1);

    // when
    await ProfileService.removeProfile(profileInput1.email);

    // then
    expect(mockRemoveProfile).toHaveBeenCalledWith(profileInput1.email);
});

test('given non-existing email; when removing a profile; then it should throw an error', async () => {
    // given
    const nonExistingEmail = "non_existing_email@example.com";
    mockGetProfileByEmail.mockResolvedValue(null);

    // when & then
    await expect(ProfileService.removeProfile(nonExistingEmail)).rejects.toThrow(`Profile with email ${nonExistingEmail} does not exist.`);
});

test('when retrieving all profiles; then it should return all profiles', async () => {
    // given
    mockGetAllProfiles.mockResolvedValue([profile1, profile2, profile3]);

    // when
    const allProfiles = await ProfileService.getAllProfiles();

    // then
    expect(allProfiles.length).toBe(3);
    expect(mockGetAllProfiles).toHaveBeenCalled();
});
