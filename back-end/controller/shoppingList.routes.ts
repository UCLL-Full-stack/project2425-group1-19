/**
 * @swagger
 * components:
 *   schemas:
 *     ShoppingList:
 *       type: object
 *       properties:
 *         ListName:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Item'
 */

import { Router, Request, Response } from "express";
import shoppingListService from "../service/shoppingList.service";
import { ShoppingListInput, ItemInput } from "../types";

const shoppingListRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: ShoppingList
 *     description: Endpoints related to shopping lists
 * /shoppingList:
 *   get:
 *     summary: Get all shopping lists
 *     tags: [ShoppingList]
 *     responses:
 *       200:
 *         description: A list of shopping lists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShoppingList'
 *       400:
 *         description: Some fetching error
 */

shoppingListRouter.get('/', async (req: Request, res: Response) => {
    try {
        const shoppingLists = await shoppingListService.getAllShoppingLists();
        res.status(200).json(shoppingLists);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: "error", errorMessage: error.message });
        }
    }
});

/**
 * @swagger
 * /shoppingList/{name}:
 *   get:
 *     summary: Get a shopping list by name
 *     tags: [ShoppingList]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the shopping list
 *     responses:
 *       200:
 *         description: The shopping list description by name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingList'
 *       404:
 *         description: Shopping list not found
 */

shoppingListRouter.get('/:name', async (req: Request, res: Response) => {
    try {
        const shoppingList = await shoppingListService.getShoppingList(req.params.name);
        res.status(200).json(shoppingList);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ status: "error", errorMessage: error.message });
        }
    }
});

/**
 * @swagger
 * /shoppingList:
 *   post:
 *     summary: Create a new shopping list
 *     tags: [ShoppingList]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShoppingList'
 *     responses:
 *       201:
 *         description: The shopping list was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingList'
 *       400:
 *         description: Some input error
 */

shoppingListRouter.post('/', async (req: Request, res: Response) => {
    try {
        const shoppingList = <ShoppingListInput>req.body;
        const newShoppingList = shoppingListService.addShoppingList(shoppingList);
        res.status(201).json(newShoppingList);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: "error", errorMessage: error.message });
        }
    }
});

/**
 * @swagger
 * /shoppingList/{name}:
 *   delete:
 *     summary: Remove a shopping list by name
 *     tags: [ShoppingList]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the shopping list
 *     responses:
 *       200:
 *         description: The shopping list was deleted
 *       404:
 *         description: Shopping list not found
 */

shoppingListRouter.delete('/:name', async (req: Request, res: Response) => {
    try {
        await shoppingListService.removeShoppingList(req.params.name);
        res.status(200).json({ status: "success", message: "Shopping list deleted successfully" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ status: "error", errorMessage: error.message });
        }
    }
});

/**
 * @swagger
 * /shoppingList/{name}/item:
 *   post:
 *     summary: Add an item to a shopping list
 *     tags: [ShoppingList]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the shopping list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: The item was added to the shopping list
 *       404:
 *         description: Shopping list not found
 */

shoppingListRouter.post('/:name/item', async (req: Request, res: Response) => {
    try {
        const itemInput = <ItemInput>req.body;
        await shoppingListService.addItemToShoppingList(req.params.name, itemInput);
        res.status(200).json({ status: "success", message: "Item added to shopping list successfully" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ status: "error", errorMessage: error.message });
        }
    }
});

/**
 * @swagger
 * /shoppingList/{name}/item/{itemName}:
 *   delete:
 *     summary: Remove an item from a shopping list
 *     tags: [ShoppingList]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the shopping list
 *       - in: path
 *         name: itemName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the item
 *     responses:
 *       200:
 *         description: The item was removed from the shopping list
 *       404:
 *         description: Shopping list or item not found
 */

shoppingListRouter.delete('/:name/item/:itemName', async (req: Request, res: Response) => {
    try {
        await shoppingListService.removeItemFromShoppingList(req.params.name, req.params.itemName);
        res.status(200).json({ status: "success", message: "Item removed from shopping list successfully" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ status: "error", errorMessage: error.message });
        }
    }
});

export default shoppingListRouter;
