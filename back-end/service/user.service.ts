import User from "../model/user";
import userDb from "../repository/user.db";
import { UserInput, AuthenticationResponse } from "../types";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';

const addUser = async (input: UserInput): Promise<User> => {
    try {
        const existingUser = await userDb.getUserByUsername( input.username);
        if (existingUser) {
            throw new Error(`User with username ${input.username} already exists.`);
        }
        
        // Ensure the user meets the rules
        const newUser = new User(input);
        return await userDb.saveUser(newUser);
    } catch (error) {
        throw new Error(`Error adding user with username ${input.username}: ${error}`);
    }
};
    //ERROR:
//     at Generator.next (<anonymous>)
//     at fulfilled (C:\Users\aboud\Documents\Full stack\Project\project2425-group1-19\back-end\repository\user.db.ts:5:58)
// Error: User with username abdul already exists.
//     at C:\Users\aboud\Documents\Full stack\Project\project2425-group1-19\back-end\service\user.service.ts:19:15
//     at Generator.throw (<anonymous>)
//     at rejected (C:\Users\aboud\Documents\Full stack\Project\project2425-group1-19\back-end\service\user.service.ts:6:65)
// [nodemon] app crashed - waiting for file changes before starting...
        

const getUser = async(username: string): Promise<User | undefined> => {
    const user = await userDb.getUserByUsername(username );

    if (user != undefined) {
        return user;
    } else {
        throw new Error(`User with username ${username} does not exist.`);
    }
};

const getAllUsers = async(): Promise<User[]> => {
    return await userDb.getAllUsers();
};

const removeUser = async(username: string): Promise<void> => {
    const user = await userDb.getUserByUsername(username);

    if (user != undefined) {
        userDb.removeUser(username);
    } else {
        throw new Error(`User with username ${username} does not exist.`);
    }
};

const authenticate = async({username, password}:UserInput): Promise<AuthenticationResponse>=> {
    const user = await userDb.getUserByUsername(username);
    if (!user || !user.password) {
        throw new Error('Invalid username or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error('Incorrect password/username.');
    }

    const tijd = process.env.JWT_EXPIRES_HOURS ? `${process.env.JWT_EXPIRES_HOURS}h` : '1h'; ;
    const secretKey = process.env.JWT_SECRET || "default_secret";
   
    const token = jwt.sign({username: user.getUsername(), role: user.getRole() }, secretKey, { expiresIn: tijd });
    return {
        token:token,
        username: user.getUsername(),
        role: user.getRole(),
    }
};

export default {
    addUser,
    getUser,
    getAllUsers,
    removeUser,
    authenticate,
};