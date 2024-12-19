import ShoppingListService from "../../service/shoppingList.service";
import shoppingListDb from "../../repository/shoppingList.db";
import Item from "../../model/item";
import ShoppingList from "../../model/shoppingList";
import { Urgency, Privacy } from "../../types";

const validListName = "Groceries";
const itemInput1 = { name: "Milk", description: "1 gallon of whole milk", price: 3.99, urgency: "high" as Urgency };
const itemInput2 = { name: "Bread", description: "Whole grain bread", price: 2.49, urgency: "low" as Urgency };
const itemInput3 = { name: "Eggs", description: "1 dozen large eggs", price: 2.99, urgency: "low" as Urgency };

const item1 = new Item(itemInput1);
const item2 = new Item(itemInput2);
const item3 = new Item(itemInput3);

jest.mock("../../repository/shoppingList.db");

const mockSaveShoppingList = jest.fn();
const mockGetShoppingListByName = jest.fn();
const mockRemoveShoppingList = jest.fn();
const mockAddItemToShoppingList = jest.fn();
const mockRemoveItemFromShoppingList = jest.fn();
const mockGetAllShoppingLists = jest.fn();

(shoppingListDb.saveShoppingList as jest.Mock) = mockSaveShoppingList;
(shoppingListDb.getShoppingListByName as jest.Mock) = mockGetShoppingListByName;
(shoppingListDb.removeShoppingList as jest.Mock) = mockRemoveShoppingList;
(shoppingListDb.addItemToShoppingList as jest.Mock) = mockAddItemToShoppingList;
(shoppingListDb.removeItemFromShoppingList as jest.Mock) = mockRemoveItemFromShoppingList;
(shoppingListDb.getAllShoppingLists as jest.Mock) = mockGetAllShoppingLists;

beforeEach(() => {
    jest.clearAllMocks();
});

test('given valid shopping list input; when adding a shopping list; then it should add the shopping list correctly', async () => {
    // given
    const shoppingListInput = { ListName: validListName, items: [itemInput1, itemInput2], privacy: 'public' as Privacy, owner: "TestOwner" };
    const newShoppingList = new ShoppingList({ ListName: validListName, items: [item1, item2], privacy: 'public' as Privacy, owner: "TestOwner" });
    mockSaveShoppingList.mockResolvedValue(newShoppingList);

    // when
    const addedList = await ShoppingListService.addShoppingList(shoppingListInput);

    // then
    expect(addedList.getListName()).toBe(validListName);
    expect(addedList.getListItems().length).toBe(2);
    expect(addedList.getPrivacy()).toBe('public');
    expect(addedList.getOwner()).toBe("TestOwner");
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
    const existingShoppingList = new ShoppingList({ ListName: validListName, items: [item1, item2], privacy: 'public', owner: "TestOwner" });
    mockGetShoppingListByName.mockResolvedValue(existingShoppingList);

    // when
    const retrievedList = await ShoppingListService.getShoppingList(validListName);

    // then
    expect(retrievedList).toBeDefined();
    expect(retrievedList?.getListName()).toBe(validListName);
    expect(retrievedList?.getPrivacy()).toBe('public');
    expect(retrievedList?.getOwner()).toBe("TestOwner");
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

test('given existing item name; when adding an item to a shopping list; then it should throw an error', async () => {
    // given
    const existingShoppingList = new ShoppingList({ ListName: validListName, items: [item1] });
    mockGetShoppingListByName.mockResolvedValue(existingShoppingList);

    // when & then
    await expect(ShoppingListService.addItemToShoppingList(validListName, itemInput1)).rejects.toThrow(`Item with name ${itemInput1.name} already exists in the shopping list ${validListName}.`);
});

test('given non-existing item name; when removing an item from a shopping list; then it should throw an error', async () => {
    // given
    const existingShoppingList = new ShoppingList({ ListName: validListName, items: [item1] });
    mockGetShoppingListByName.mockResolvedValue(existingShoppingList);

    // when & then
    await expect(ShoppingListService.removeItemFromShoppingList(validListName, itemInput2.name)).rejects.toThrow(`Item with name ${itemInput2.name} does not exist in the shopping list ${validListName}.`);
});

test('given valid privacy; when setting privacy; then it should set the privacy correctly', async () => {
    // given
    const existingShoppingList = new ShoppingList({ ListName: validListName, items: [item1, item2], privacy: 'public' });
    mockGetShoppingListByName.mockResolvedValue(existingShoppingList);

    // when
    existingShoppingList.setPrivacy('adultOnly');

    // then
    expect(existingShoppingList.getPrivacy()).toBe('adultOnly');
});

test('given invalid privacy; when setting privacy; then it should throw an error', async () => {
    // given
    const existingShoppingList = new ShoppingList({ ListName: validListName, items: [item1, item2], privacy: 'public' });
    const invalidPrivacy = "invalid" as any;

    // when & then
    expect(() => {
        existingShoppingList.setPrivacy(invalidPrivacy);
    }).toThrow('Privacy can only be set to the following values: public, adultOnly, private');
});

test('given valid owner; when setting owner; then it should set the owner correctly', async () => {
    // given
    const existingShoppingList = new ShoppingList({ ListName: validListName, items: [item1, item2], owner: "TestOwner" });
    mockGetShoppingListByName.mockResolvedValue(existingShoppingList);

    // when
    existingShoppingList.setOwner("NewOwner");

    // then
    expect(existingShoppingList.getOwner()).toBe("NewOwner");
});

test('given invalid owner; when setting owner; then it should throw an error', async () => {
    // given
    const existingShoppingList = new ShoppingList({ ListName: validListName, items: [item1, item2], owner: "TestOwner" });
    const invalidOwner = 123 as any;

    // when & then
    expect(() => {
        existingShoppingList.setOwner(invalidOwner);
    }).toThrow('Invalid owner name');
});
