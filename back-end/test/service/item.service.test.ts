import ItemService from "../../service/item.service";
import itemDb from "../../repository/item.db";
import Item from "../../model/item";
import {Urgency} from "../../types";

const itemInput1 = { name: "Milk", description: "1 gallon of whole milk", price: 3.99, urgency: "high" as Urgency};
const itemInput2 = { name: "Bread", description: "Whole grain bread", price: 2.49, urgency: "low" as Urgency};
const itemInput3 = { name: "Eggs", description: "1 dozen large eggs", price: 2.99, urgency: "mid" as Urgency };

const item1 = new Item(itemInput1);
const item2 = new Item(itemInput2);
const item3 = new Item(itemInput3);

jest.mock("../../repository/item.db");

// Change to use jest.fn so mocking is cleaner
const mockSaveItem = jest.fn();
const mockGetItemByName = jest.fn();
const mockRemoveItem = jest.fn();
const mockGetAllItems = jest.fn();

// Dan mock zo
itemDb.saveItem = mockSaveItem;
itemDb.getItemByName = mockGetItemByName;
itemDb.removeItem = mockRemoveItem;
itemDb.getAllItems = mockGetAllItems;

beforeEach(() => {
    jest.clearAllMocks();
});

test('given valid item input; when adding an item; then it should add the item correctly', async () => {
    // given
    mockGetItemByName.mockResolvedValue(null);
    mockSaveItem.mockResolvedValue(item1);

    // when
    const addedItem = await ItemService.addItem(itemInput1);

    // then
    expect(addedItem.getName()).toBe(itemInput1.name);
    expect(mockSaveItem).toHaveBeenCalledWith(expect.any(Item));
});

test('given existing item name; when adding an item; then it should throw an error', async () => {
    // given
    mockGetItemByName.mockResolvedValue(item1);

    // when & then
    await expect(ItemService.addItem(itemInput1)).rejects.toThrow(`Item with name ${itemInput1.name} already exists.`);
});

test('given valid item name; when retrieving an item; then it should return the item', async () => {
    // given
    mockGetItemByName.mockResolvedValue(item1);

    // when
    const retrievedItem = await ItemService.getItem(itemInput1.name);

    // then
    expect(retrievedItem).toBeDefined();
    expect(retrievedItem?.getName()).toBe(itemInput1.name);
    expect(mockGetItemByName).toHaveBeenCalledWith({ name: itemInput1.name });
});

test('given non-existing item name; when retrieving an item; then it should throw an error', async () => {
    // given
    const nonExistingItemName = "NonExistingItem";
    mockGetItemByName.mockResolvedValue(null);

    // when & then
    await expect(ItemService.getItem(nonExistingItemName)).rejects.toThrow(`Item with name ${nonExistingItemName} does not exist.`);
});

test('given valid item name; when removing an item; then it should remove the item', async () => {
    // given
    mockGetItemByName.mockResolvedValue(item1);

    // when
    await ItemService.removeItem(itemInput1.name);

    // then
    expect(mockRemoveItem).toHaveBeenCalledWith(itemInput1.name);
});

test('given non-existing item name; when removing an item; then it should throw an error', async () => {
    // given
    const nonExistingItemName = "NonExistingItem";
    mockGetItemByName.mockResolvedValue(null);

    // when & then
    await expect(ItemService.removeItem(nonExistingItemName)).rejects.toThrow(`Item with name ${nonExistingItemName} does not exist.`);
});

test('when retrieving all items; then it should return all items', async () => {
    // given
    mockGetAllItems.mockResolvedValue([item1, item2, item3]);

    // when
    const allItems = await ItemService.getAllItems();

    // then
    expect(allItems.length).toBe(3);
    expect(mockGetAllItems).toHaveBeenCalled();
});
