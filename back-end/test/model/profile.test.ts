import Profile from "../../model/profile";

// Global constants for valid inputs
const validEmail = "test@example.com";
const validName = "John";
const validLastName = "Doe";
const validUserId = 1;

test('given valid values; when creating a profile; then it should create the profile correctly', () => {
    // given
    const profileData = { email: validEmail, name: validName, lastName: validLastName, userId: validUserId };

    // when
    const newProfile = new Profile(profileData);

    // then
    expect(newProfile.getEmail()).toBe(validEmail);
    expect(newProfile.name).toBe(validName);
    expect(newProfile.lastName).toBe(validLastName);
    expect(newProfile.userId).toBe(validUserId);
});

test('given invalid email; when creating a profile; then it should throw an error', () => {
    // given
    const invalidEmail = "invalidemail" as any;

    // when & then
    expect(() => {
        new Profile({ email: invalidEmail, name: validName, lastName: validLastName, userId: validUserId });
    }).toThrow('Invalid email value');
});

test('given email longer than 60 characters; when creating a profile; then it should throw an error', () => {
    // given
    const longEmail = "a".repeat(61) + "@example.com";

    // when & then
    expect(() => {
        new Profile({ email: longEmail, name: validName, lastName: validLastName, userId: validUserId });
    }).toThrow('Invalid email value');
});

test('given invalid name; when creating a profile; then it should throw an error', () => {
    // given
    const invalidName = 123 as any;

    // when & then
    expect(() => {
        new Profile({ email: validEmail, name: invalidName, lastName: validLastName, userId: validUserId });
    }).toThrow('Invalid name value');
});

test('given name longer than 40 characters; when creating a profile; then it should throw an error', () => {
    // given
    const longName = "a".repeat(41);

    // when & then
    expect(() => {
        new Profile({ email: validEmail, name: longName, lastName: validLastName, userId: validUserId });
    }).toThrow('Invalid name value');
});

test('given invalid lastName; when creating a profile; then it should throw an error', () => {
    // given
    const invalidLastname = 123 as any;

    // when & then
    expect(() => {
        new Profile({ email: validEmail, name: validName, lastName: invalidLastname, userId: validUserId });
    }).toThrow('Invalid lastname value');
});

test('given lastName longer than 60 characters; when creating a profile; then it should throw an error', () => {
    // given
    const longLastname = "a".repeat(61);

    // when & then
    expect(() => {
        new Profile({ email: validEmail, name: validName, lastName: longLastname, userId: validUserId });
    }).toThrow('Invalid lastname value');
});

test('given valid profile; when getting full name; then it should return the correct full name', () => {
    // given
    const newProfile = new Profile({ email: validEmail, name: validName, lastName: validLastName, userId: validUserId });

    // when
    const fullName = newProfile.getFullName();

    // then
    expect(fullName).toBe("John Doe");
});

test('given valid profile; when getting abbreviated name; then it should return the correct abbreviated name', () => {
    // given
    const newProfile = new Profile({ email: validEmail, name: validName, lastName: validLastName, userId: validUserId });

    // when
    const abbreviatedName = newProfile.getAbbreviatedName();

    // then
    expect(abbreviatedName).toBe("JD");
});

test('given valid new name; when updating the name; then it should update the name correctly', () => {
    // given
    const newProfile = new Profile({ email: validEmail, name: validName, lastName: validLastName, userId: validUserId });
    const newName = "Jane";

    // when
    newProfile.setName(newName);

    // then
    expect(newProfile.name).toBe(newName);
});

test('given valid new lastName; when updating the lastName; then it should update the lastName correctly', () => {
    // given
    const newProfile = new Profile({ email: validEmail, name: validName, lastName: validLastName, userId: validUserId });
    const newLastname = "Smith";

    // when
    newProfile.setLastName(newLastname);

    // then
    expect(newProfile.lastName).toBe(newLastname);
});
