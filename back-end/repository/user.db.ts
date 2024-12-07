import User from "../model/user";
import database from "./database";

const users: Array<User> = [];

const saveUser = async (user: User): Promise<User> => {
    try {
        const userDatabase = await database.user.create({
            data: {
                username: user.getUsername(),
                password: user.password,
                role: user.getRole(),
            },
        });
        return new User({
            username: userDatabase.username,
            password: userDatabase.password,
            role: userDatabase.role,
        });
    } catch (error) {
        throw new Error('Database Error while creating user:' + error)
    }
};

const getUserByUsername = async ({username}: {username: string}): Promise<User | undefined> => {
    try {
        const user = await database.user.findUnique({
            where: {username},
        });
        if (user) {
            return new User({
                username: user.username,
                password: user.password,
                role: user.role,
            });
        } else {
            throw new Error('No User found with given user name')
        };
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

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
        role: user.role,
    }));
};

const createTestUsers = (): void => {
    const user1 = new User({username: "Janneke", password: "B@2", role: "admin"});
    const user2 = new User({username: "Jannineke", password: "A&2", role: "member"});
    const user3 = new User({username: "Jeanke", password: "C|3", role: "member"});
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

};
