/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description: 
 *           type: string
 *         price:
 *           type: number
 *         urgency:
 *           type: string
 */

import { Router, Request, Response } from "express";
import itemService from "../service/item.service";

const itemRouter = Router();

//GETS

/**
 * @swagger
 * tags:
 *   - name: Item
 *     description: Endpoints related to items
 * /item:
 *   get:
 *     summary: Get all items
 *     tags: [Item]
 *     responses:
 *       200:
 *         description: A list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       400:
 *         description: Some fetching error
 */

itemRouter.get('/', async (req: Request, res: Response) => {
    try {
        const items = await itemService.getAllItems();
        res.status(200).json(items)
    } catch (error) { //Waarom lukt error.message niet direct?
        if (error instanceof Error) {
            res.status(400).json({ status: "error", errorMessage: error.message });
        }
    }
});

// GET a single item by name

/**
 * @swagger
 * /item/{name}:
 *   get:
 *     summary: Get an item by name
 *     tags: [Item]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the item
 *     responses:
 *       200:
 *         description: The item description by name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 */

itemRouter.get('/:name', async (req: Request, res: Response) => {
    try {
        const item = await itemService.getItem(req.params.name);
        res.status(200).json(item);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ status: "error", errorMessage: error.message });
        }
    }
});

// POST a new item

/**
 * @swagger
 * /item:
 *   post:
 *     summary: Create a new item
 *     tags: [Item]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: The item was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Some input error
 */

itemRouter.post('/', async (req: Request, res: Response) => {
    try {
        const newItem = await itemService.addItem(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: "error", errorMessage: error.message });
        }
    }
});

// DELETE an item by name

/**
 * @swagger
 * /item/{name}:
 *   delete:
 *     summary: Remove an item by name
 *     tags: [Item]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the item
 *     responses:
 *       200:
 *         description: The item was deleted
 *       404:
 *         description: Item not found
 */

itemRouter.delete('/:name', async (req: Request, res: Response) => {
    try {
        await itemService.removeItem(req.params.name);
        res.status(200).json({ status: "success", message: "Item deleted successfully" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ status: "error", errorMessage: error.message });
        }
    }
});

export default itemRouter;