import User from "../model/user";
import userDb from "../repository/user.db";
import { UserInput } from "../types";

const addUser = (input: UserInput): User => {
    try {
        const existingUser = userDb.getUserByUsername({ username: input.username });
        if (existingUser) {
            throw new Error(`User with username ${input.username} already exists.`);
        }
        //Om zeker te zijn dat de item voldoet aan de regels
        const newUser = new User(input);
        return userDb.saveUser(newUser);
    } catch (error) {
        throw new Error(`User with username ${input.username} already exists.`)
    }
        
};

const getUser = (username: string): User | undefined => {
    const user = userDb.getUserByUsername({ username });

    if (user != undefined) {
        return user;
    } else {
        throw new Error(`User with username ${username} does not exist.`);
    }
};

const getAllUsers = (): User[] => {
    return userDb.getAllUsers();
};

const removeUser = (username: string): void => {
    const user = userDb.getUserByUsername({ username });

    if (user != undefined) {
        userDb.removeUser(username);
    } else {
        throw new Error(`User with username ${username} does not exist.`);
    }
};


export default {
    addUser,
    getUser,
    getAllUsers,
    removeUser,
};