/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 */

import { Router, Request, Response } from "express";
import userService from "../service/user.service";
import { UserInput } from "../types";

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Endpoints related to users
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Some fetching error
 */

userRouter.get('/', async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: "error", errorMessage: error.message });
        }
    }
});

/**
 * @swagger
 * /user/{username}:
 *   get:
 *     summary: Get a user by username
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the user
 *     responses:
 *       200:
 *         description: The user description by username
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */

userRouter.get('/:username', async (req: Request, res: Response) => {
    try {
        const user = await userService.getUser(req.params.username);
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ status: "error", errorMessage: error.message });
        }
    }
});

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Some input error
 */

userRouter.post('/', async (req: Request, res: Response) => {
    try {
        const user = <UserInput>req.body;
        const newUser = userService.addUser(user);
        res.status(201).json(newUser);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: "error", errorMessage: error.message });
        }
    }
});

/**
 * @swagger
 * /user/{username}:
 *   delete:
 *     summary: Remove a user by username
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the user
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: User not found
 */

userRouter.delete('/:username', async (req: Request, res: Response) => {
    try {
        await userService.removeUser(req.params.username);
        res.status(200).json({ status: "success", message: "User deleted successfully" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ status: "error", errorMessage: error.message });
        }
    }
});

export default userRouter;
