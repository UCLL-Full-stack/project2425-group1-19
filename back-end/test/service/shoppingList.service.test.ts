import ShoppingListService from "../../service/shoppingList.service";
import shoppingListDb from "../../repository/shoppingList.db";
import Item from "../../model/item";
import ShoppingList from "../../model/shoppingList";
import {Urgency} from "../../types";

const validListName = "Groceries";
const itemInput1 = { name: "Milk", description: "1 gallon of whole milk", price: 3.99, urgency: "High Priority" as Urgency};
const itemInput2 = { name: "Bread", description: "Whole grain bread", price: 2.49, urgency: "Not a Priority" as Urgency};
const itemInput3 = { name: "Eggs", description: "1 dozen large eggs", price: 2.99, urgency: "Low Priority" as Urgency};

const item1 = new Item(itemInput1);
const item2 = new Item(itemInput2);
const item3 = new Item(itemInput3);

jest.mock("../../repository/shoppingList.db");

const mockSaveShoppingList = shoppingListDb.saveShoppingList as jest.Mock;
const mockGetShoppingListByName = shoppingListDb.getShoppingListByName as jest.Mock;
const mockRemoveShoppingList = shoppingListDb.removeShoppingList as jest.Mock;
const mockAddItemToShoppingList = shoppingListDb.addItemToShoppingList as jest.Mock;
const mockRemoveItemFromShoppingList = shoppingListDb.removeItemFromShoppingList as jest.Mock;

beforeEach(() => {
    jest.clearAllMocks();
});

test('given valid shopping list input; when adding a shopping list; then it should add the shopping list correctly', async () => {
    // given
    const shoppingListInput = { name: validListName, items: [itemInput1, itemInput2] };
    const newShoppingList = new ShoppingList({ ListName: validListName, items: [item1, item2] });
    mockSaveShoppingList.mockResolvedValue(newShoppingList);

    // when
    const addedList = await ShoppingListService.addShoppingList(shoppingListInput);

    // then
    expect(addedList.getListName()).toBe(validListName);
    expect(addedList.getListItems().length).toBe(2);
    expect(mockSaveShoppingList).toHaveBeenCalledWith(expect.any(ShoppingList));
});

test('given existing shopping list name; when adding a shopping list; then it should throw an error', async () => {
    // given
    const shoppingListInput = { ListName: validListName, items: [itemInput1, itemInput2] };
    const existingShoppingList = new ShoppingList({ ListName: validListName, items: [item1, item2] });
    mockGetShoppingListByName.mockResolvedValue(existingShoppingList);

    // when & then
    await expect(ShoppingListService.addShoppingList(shoppingListInput)).rejects.toThrow(`Shopping list with name ${validListName} already exists.`);
});

test('given valid shopping list name; when retrieving a shopping list; then it should return the shopping list', async () => {
    // given
    const existingShoppingList = new ShoppingList({ ListName: validListName, items: [item1, item2] });
    mockGetShoppingListByName.mockResolvedValue(existingShoppingList);

    // when
    const retrievedList = await ShoppingListService.getShoppingList(validListName);

    // then
    expect(retrievedList).toBeDefined();
    expect(retrievedList?.getListName()).toBe(validListName);
    expect(mockGetShoppingListByName).toHaveBeenCalledWith(validListName);
});

test('given non-existing shopping list name; when retrieving a shopping list; then it should throw an error', async () => {
    // given
    const nonExistingListName = "NonExistingList";
    mockGetShoppingListByName.mockResolvedValue(null);

    // when & then
    await expect(ShoppingListService.getShoppingList(nonExistingListName)).rejects.toThrow(`Shopping list with name ${nonExistingListName} does not exist.`);
});

test('given valid shopping list name; when removing a shopping list; then it should remove the shopping list', async () => {
    // given
    const existingShoppingList = new ShoppingList({ ListName: validListName, items: [item1, item2] });
    mockGetShoppingListByName.mockResolvedValue(existingShoppingList);

    // when
    await ShoppingListService.removeShoppingList(validListName);

    // then
    expect(mockRemoveShoppingList).toHaveBeenCalledWith(validListName);
});

test('given non-existing shopping list name; when removing a shopping list; then it should throw an error', async () => {
    // given
    const nonExistingListName = "NonExistingList";
    mockGetShoppingListByName.mockResolvedValue(null);

    // when & then
    await expect(ShoppingListService.removeShoppingList(nonExistingListName)).rejects.toThrow(`Shopping list with name ${nonExistingListName} does not exist.`);
});

test('given valid item input; when adding an item to a shopping list; then it should add the item correctly', async () => {
    // given
    const existingShoppingList = new ShoppingList({ ListName: validListName, items: [item1] });
    mockGetShoppingListByName.mockResolvedValue(existingShoppingList);

    // when
    await ShoppingListService.addItemToShoppingList(validListName, itemInput2);

    // then
    expect(mockAddItemToShoppingList).toHaveBeenCalledWith(validListName, expect.any(Item));
});

test('given existing item name; when adding an item to a shopping list; then it should throw an error', async () => {
    // given
    const existingShoppingList = new ShoppingList({ ListName: validListName, items: [item1] });
    mockGetShoppingListByName.mockResolvedValue(existingShoppingList);

    // when & then
    await expect(ShoppingListService.addItemToShoppingList(validListName, itemInput1)).rejects.toThrow(`Item with name ${itemInput1.name} already exists in the shopping list ${validListName}.`);
});

test('given valid item name; when removing an item from a shopping list; then it should remove the item', async () => {
    // given
    const existingShoppingList = new ShoppingList({ ListName: validListName, items: [item1, item2] });
    mockGetShoppingListByName.mockResolvedValue(existingShoppingList);

    // when
    await ShoppingListService.removeItemFromShoppingList(validListName, itemInput1.name);

    // then
    expect(mockRemoveItemFromShoppingList).toHaveBeenCalledWith(validListName, itemInput1.name);
});

test('given non-existing item name; when removing an item from a shopping list; then it should throw an error', async () => {
    // given
    const existingShoppingList = new ShoppingList({ ListName: validListName, items: [item1] });
    mockGetShoppingListByName.mockResolvedValue(existingShoppingList);

    // when & then
    await expect(ShoppingListService.removeItemFromShoppingList(validListName, itemInput2.name)).rejects.toThrow(`Item with name ${itemInput2.name} does not exist in the shopping list ${validListName}.`);
});
