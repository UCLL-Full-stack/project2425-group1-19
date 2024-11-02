import ProfileService from "../../service/profile.service";
import profileDb from "../../repository/profile.db";
import Profile from "../../model/profile";
import { ProfileInput } from "../../types";

// Sample profile inputs
const profileInput1: ProfileInput = { email: "john.doe@example.com", name: "John", lastname: "Doe" };
const profileInput2: ProfileInput = { email: "jane.doe@example.com", name: "Jane", lastname: "Doe" };
const profileInput3: ProfileInput = { email: "mark.smith@example.com", name: "Mark", lastname: "Smith" };

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

test('given valid profile input; when adding a profile; then it should add the profile correctly', () => {
    // given
    mockGetProfileByEmail.mockReturnValue(undefined);
    mockSaveProfile.mockReturnValue(profile1);

    // when
    const addedProfile = ProfileService.addProfile(profileInput1);

    // then
    expect(addedProfile.getEmail()).toBe(profileInput1.email);
    expect(mockSaveProfile).toHaveBeenCalledWith(expect.any(Profile));
});

test('given existing email; when adding a profile; then it should throw an error', () => {
    // given
    mockGetProfileByEmail.mockReturnValue(profile1);

    // when & then
    expect(() => {
        ProfileService.addProfile(profileInput1);
    }).toThrow(`Profile with email ${profileInput1.email} already exists.`);
});

test('given valid email; when retrieving a profile; then it should return the profile', () => {
    // given
    mockGetProfileByEmail.mockReturnValue(profile1);

    // when
    const retrievedProfile = ProfileService.getProfileByEmail(profileInput1.email);

    // then
    expect(retrievedProfile).toBeDefined();
    expect(retrievedProfile?.getEmail()).toBe(profileInput1.email);
    expect(mockGetProfileByEmail).toHaveBeenCalledWith({ email: profileInput1.email });
});

test('given non-existing email; when retrieving a profile; then it should throw an error', () => {
    // given
    const nonExistingEmail = "non_existing_email@example.com";
    mockGetProfileByEmail.mockReturnValue(undefined);

    // when & then
    expect(() => {
        ProfileService.getProfileByEmail(nonExistingEmail);
    }).toThrow(`Profile with email ${nonExistingEmail} does not exist.`);
});

test('given valid email; when removing a profile; then it should remove the profile', () => {
    // given
    mockGetProfileByEmail.mockReturnValue(profile1);

    // when
    ProfileService.removeProfile(profileInput1.email);

    // then
    expect(mockRemoveProfile).toHaveBeenCalledWith(profileInput1.email);
});

test('given non-existing email; when removing a profile; then it should throw an error', () => {
    // given
    const nonExistingEmail = "non_existing_email@example.com";
    mockGetProfileByEmail.mockReturnValue(undefined);

    // when & then
    expect(() => {
        ProfileService.removeProfile(nonExistingEmail);
    }).toThrow(`Profile with email ${nonExistingEmail} does not exist.`);
});

test('when retrieving all profiles; then it should return all profiles', () => {
    // given
    mockGetAllProfiles.mockReturnValue([profile1, profile2, profile3]);

    // when
    const allProfiles = ProfileService.getAllProfiles();

    // then
    expect(allProfiles.length).toBe(3);
    expect(mockGetAllProfiles).toHaveBeenCalled();
});
