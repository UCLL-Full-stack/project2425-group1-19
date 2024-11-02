import UserService from "../../service/user.service";
import userDb from "../../repository/user.db";
import User from "../../model/user";
import { UserInput } from "../../types";

// Sample user inputs
const userInput1: UserInput = { username: "Janneke", password: "B@1", role: "admin" };
const userInput2: UserInput = { username: "Jannineke", password: "A&2", role: "member" };
const userInput3: UserInput = { username: "Jeanke", password: "C|3", role: "member" };

const user1 = new User(userInput1);
const user2 = new User(userInput2);
const user3 = new User(userInput3);

// Mocking the user database
jest.mock("../../repository/user.db");

const mockSaveUser = userDb.saveUser as jest.Mock;
const mockGetUserByUsername = userDb.getUserByUsername as jest.Mock;
const mockRemoveUser = userDb.removeUser as jest.Mock;
const mockGetAllUsers = userDb.getAllUsers as jest.Mock;

beforeEach(() => {
    jest.clearAllMocks();
});

test('given valid user input; when adding a user; then it should add the user correctly', () => {
    // given
    mockGetUserByUsername.mockReturnValue(undefined);
    mockSaveUser.mockReturnValue(user1);

    // when
    const addedUser = UserService.addUser(userInput1);

    // then
    expect(addedUser.getUsername()).toBe(userInput1.username);
    expect(mockSaveUser).toHaveBeenCalledWith(expect.any(User));
});

test('given existing username; when adding a user; then it should throw an error', () => {
    // given
    mockGetUserByUsername.mockReturnValue(user1);

    // when & then
    expect(() => {
        UserService.addUser(userInput1);
    }).toThrow(`User with username ${userInput1.username} already exists.`);
});

test('given valid username; when retrieving a user; then it should return the user', () => {
    // given
    mockGetUserByUsername.mockReturnValue(user1);

    // when
    const retrievedUser = UserService.getUser(userInput1.username);

    // then
    expect(retrievedUser).toBeDefined();
    expect(retrievedUser?.getUsername()).toBe(userInput1.username);
    expect(mockGetUserByUsername).toHaveBeenCalledWith({ username: userInput1.username });
});

test('given non-existing username; when retrieving a user; then it should throw an error', () => {
    // given
    const nonExistingUsername = "non_existing_user";
    mockGetUserByUsername.mockReturnValue(undefined);

    // when & then
    expect(() => {
        UserService.getUser(nonExistingUsername);
    }).toThrow(`User with username ${nonExistingUsername} does not exist.`);
});

test('given valid username; when removing a user; then it should remove the user', () => {
    // given
    mockGetUserByUsername.mockReturnValue(user1);

    // when
    UserService.removeUser(userInput1.username);

    // then
    expect(mockRemoveUser).toHaveBeenCalledWith(userInput1.username);
});

test('given non-existing username; when removing a user; then it should throw an error', () => {
    // given
    const nonExistingUsername = "non_existing_user";
    mockGetUserByUsername.mockReturnValue(undefined);

    // when & then
    expect(() => {
        UserService.removeUser(nonExistingUsername);
    }).toThrow(`User with username ${nonExistingUsername} does not exist.`);
});

test('when retrieving all users; then it should return all users', () => {
    // given
    mockGetAllUsers.mockReturnValue([user1, user2, user3]);

    // when
    const allUsers = UserService.getAllUsers();

    // then
    expect(allUsers.length).toBe(3);
    expect(mockGetAllUsers).toHaveBeenCalled();
});
