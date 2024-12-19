import User from "../model/user";
import { UserInput } from "../types";
import database from "./database";
import bcrypt from 'bcrypt';

// const users: Array<User> = [];

const saveUser = async (user: User): Promise<User> => {
    try {
        const existingUser = await database.user.findUnique({
            where: { username: user.getUsername() },
        });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(user.password, 12)

        const userDatabase = await database.user.create({
            data: {
                username: user.getUsername(),
                password: hashedPassword,
                role: user.getRole(),
            },
        });

        return new User({
            username: userDatabase.username,
            password: hashedPassword,
            role: userDatabase.role as 'admin' | 'adult' | 'child',
        });
    } catch (error) {
        throw new Error('Database Error while creating user:' + error)
    }
};

const getUserByUsername = async (username:string): Promise<User | undefined> => {
    try {
        const user = await database.user.findUnique({
            where: {username},
        });
        if (user) {
            return User.from(user);
        } else {
            //throw new Error('No User found with given user name')
            return undefined;
        };
    } catch (error) {
        console.log(error)
        throw new Error('Database error. See server log for details.');
    }
};

const getUserById = async (id: number): Promise<User | undefined> => {
    try {
        const user = await database.user.findUnique({
            where: {id},
        });
        if (user) {
            return User.from(user);
        } else {
            return undefined;
        }
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
}

const removeUser = async (username: string): Promise<void> => {
    try {
        await database.user.delete({
            where: {username},
        })
    } catch (error) {
        throw new Error('Error deleting user:' + error)
    }
};

const getAllUsers = async (): Promise<Array<User>> => {
    const users = await database.user.findMany();
    return users.map((user: { username: string; password: string; role: string; id: number }) => new User({
        username: user.username,
        password: user.password,
        role: user.role as 'admin' | 'adult' | 'child',
    }));
};

const createTestUsers = (): void => {
    const user1 = new User({username: "Janneke", password: "B@2", role: "admin"});
    const user2 = new User({username: "Jannineke", password: "A&2", role: "adult"});
    const user3 = new User({username: "Jeanke", password: "C|3", role: "child"});
    saveUser(user1);
    saveUser(user2);
    saveUser(user3);
};
//createTestUsers();

export default {
    saveUser,
    getUserByUsername,
    removeUser,
    getAllUsers,
    createTestUsers,
    getUserById,

};
