/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 *           enum:
 *             - adult
 *             - admin
 *             - child
 */

import {Router, Request, Response, NextFunction} from "express";
import userService from "../service/user.service";
import {UserInput} from "../types";

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Endpoints related to users
 * /user:
 *   get:
 *     security:
 *       - bearerAuth: []
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
            res.status(400).json({status: "error", errorMessage: error.message});
        }
    }
});

/**
 * @swagger
 * /user/{username}:
 *   get:
 *     security:
 *       - bearerAuth: []
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
            res.status(404).json({status: "error", errorMessage: error.message});
        }
    }
});

/**
 * @swagger
 * /user/signup:
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
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Some input error
 */

userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = <UserInput> req.body;
        const newUser = userService.addUser(user);
        res.status(200).json(newUser);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({status: "error", errorMessage: error.message});
        }
    }
});

/**
 * @swagger
 * /user/{username}:
 *   delete:
 *     security:
 *       - bearerAuth: []
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
        res.status(200).json({status: "success", message: "User deleted successfully"});
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({status: "error", errorMessage: error.message});
        }
    }
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login and get authenticated. The example password is the real password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *                 example: admin
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid username or password
 *       500:
 *         description: Internal server error
 */
userRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const user: UserInput = req.body;
        const response = await userService.authenticate(user);
        res.status(200).json({message:"Authentication successful", ...response})
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({name: 'UnauthorizedError', status: "UnauthorizedError", errorMessage: error.message});
        }
    }
});

export default userRouter;
