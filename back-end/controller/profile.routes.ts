import { Router, Request, Response, NextFunction } from "express";
import profileService from "../service/profile.service";
import { ProfileInput } from "../types";
import Profile from "../model/profile";

const profileRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         lastName:
 *           type: string
 *         userId:
 *           type: number
 */

/**
 * @swagger
 * tags:
 *   - name: Profile
 *     description: Endpoints related to profiles
 * /profile:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all profiles
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: A list of profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Some fetching error
 */

profileRouter.get('/', async (req: Request, res: Response) => {
    try {
        const profiles = await profileService.getAllProfiles();
        res.status(200).json(profiles);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: "error", errorMessage: error.message });
        }
    }
});

/**
 * @swagger
 * /profile/{userId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a profile by userId
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The userId of the profile
 *     responses:
 *       200:
 *         description: The profile description by userId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 errorMessage:
 *                   type: string
 *                   example: Profile not found
 */

profileRouter.get('/:userId', async (req: Request, res: Response) => {
    try {
        const profile = await profileService.getProfileByUserId(parseInt(req.params.userId));
        res.status(200).json(profile);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ status: "error", errorMessage: error.message });
        }
    }
});

/**
 * @swagger
 * /profile:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new profile
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       201:
 *         description: The profile was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Some input error
 */

profileRouter.post('/', async (req: Request, res: Response) => {
    try {
        const profile = <ProfileInput>req.body;
        const newProfile = profileService.addProfile(profile);
        res.status(201).json(newProfile);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: "error", errorMessage: error.message });
        }
    }
});

/**
 * @swagger
 * /profile/{userId}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a profile by userId
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The userId of the profile to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: The profile was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Some input error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 errorMessage:
 *                   type: string
 *                   example: Name, email, and last name are required
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 errorMessage:
 *                   type: string
 *                   example: Profile not found
 */

profileRouter.put('/:userId', async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const { name, email, lastName } = req.body;

        if (!name || !email || !lastName) {
            return res.status(400).json({ status: "error", errorMessage: "Name, email, and last name are required" });
        }

        const profileInput: ProfileInput = {
            userId,
            name,
            email,
            lastName,
        };

        const updatedProfile = await profileService.updateProfile(profileInput);
        res.status(200).json(updatedProfile);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: "error", errorMessage: error.message });
        }
    }
});


////**
// * @swagger
 //* /profile/{email}:
 //*   get:
 //*     security:
 //*       - bearerAuth: []
 //*     summary: Get a profile by email
 //*     tags: [Profile]
 //*     parameters:
 //*       - in: path
 //*         name: email
 //*         schema:
 //*           type: string
 //*         required: true
 //*         description: The email of the profile
 //*     responses:
 //*       200:
 //*         description: The profile description by email
 //*         content:
 //*           application/json:
 //*             schema:
 //*               $ref: '#/components/schemas/Profile'
 //*       404:
 //*         description: Profile not found
 //*/



//profileRouter.get('/:email', async (req: Request, res: Response) => {
 //   try {
 //       const profile = await profileService.getProfileByEmail(req.params.email);
 //       res.status(200).json(profile);
 //   } catch (error) {
 //       if (error instanceof Error) {
  //          res.status(404).json({ status: "error", errorMessage: error.message });
  //      }
  //  }
//});


/**
 * @swagger
 * /profile/{email}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove a profile by email
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The email of the profile
 *     responses:
 *       200:
 *         description: The profile was successfully deleted
 *       404:
 *         description: Profile not found
 */

profileRouter.delete('/:email', async (req: Request, res: Response) => {
    try {
        await profileService.removeProfile(req.params.email);
        res.status(200).json({ status: "success", message: "Profile deleted successfully" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ status: "error", errorMessage: error.message });
        }
    }
});

export default profileRouter;
