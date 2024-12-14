import User from "../../model/user";

const validUsername = "testuser";
const validPassword = "Password@123";
const validRole: "admin" | "adult" | "child" = "admin";

test('given valid values; when creating a user; then it should create the user correctly', () => {
    // given
    const userData = { username: validUsername, password: validPassword, role: validRole };

    // when
    const newUser = new User(userData);

    // then
    expect(newUser.getUsername()).toBe(validUsername);
    expect(newUser.password).toBe(validPassword);
    expect(newUser.getRole()).toBe(validRole);
});

test('given invalid username; when creating a user; then it should throw an error', () => {
    // given
    const invalidUsername = 123 as any;

    // when & then
    expect(() => {
        new User({ username: invalidUsername, password: validPassword, role: validRole });
    }).toThrow('Invalid username value');
});

test('given username longer than 40 characters; when creating a user; then it should throw an error', () => {
    // given
    const longUsername = "a".repeat(41);

    // when & then
    expect(() => {
        new User({ username: longUsername, password: validPassword, role: validRole });
    }).toThrow('Invalid username value');
});

test('given invalid password; when creating a user; then it should throw an error', () => {
    // given
    const invalidPassword = "password" as any;

    // when & then
    expect(() => {
        new User({ username: validUsername, password: invalidPassword, role: validRole });
    }).toThrow('Password must have an upper case');
});

test('given password without special character; when creating a user; then it should throw an error', () => {
    // given
    const invalidPassword = "Password123";

    // when & then
    expect(() => {
        new User({ username: validUsername, password: invalidPassword, role: validRole });
    }).toThrow('Password must contain a special character');
});

test('given invalid role; when creating a user; then it should throw an error', () => {
    // given
    const invalidRole = 123 as any;

    // when & then
    expect(() => {
        new User({ username: validUsername, password: validPassword, role: invalidRole });
    }).toThrow('Invalid role value');
});

test('given valid new role; when updating the user role; then it should update the role correctly', () => {
    // given
    const newUser = new User({ username: validUsername, password: validPassword, role: validRole });
    const newRole:any = 'user';

    // when
    newUser.setRole(newRole);

    // then
    expect(newUser.getRole()).toBe(newRole);
});

test('given valid new password; when updating the user password; then it should update the password correctly', () => {
    // given
    const newUser = new User({ username: validUsername, password: validPassword, role: validRole });
    const newPassword = "NewPassword@123";

    // when
    newUser.setPassword(newPassword);

    // then
    expect(newUser.password).toBe(newPassword);
});

test('given invalid new password; when updating the user password; then it should throw an error', () => {
    // given
    const newUser = new User({ username: validUsername, password: validPassword, role: validRole });
    const invalidPassword = "newpassword" as any;

    // when & then
    expect(() => {
        newUser.setPassword(invalidPassword);
    }).toThrow('Password must have an upper case');
});
