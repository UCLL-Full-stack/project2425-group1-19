import ItemService from "../../service/item.service";
import itemDb from "../../repository/item.db";
import Item from "../../model/item";

const itemInput1 = { name: "Milk", description: "1 gallon of whole milk", price: 3.99, urgency: "High Priority" };
const itemInput2 = { name: "Bread", description: "Whole grain bread", price: 2.49, urgency: "Not a Priority" };
const itemInput3 = { name: "Eggs", description: "1 dozen large eggs", price: 2.99, urgency: "Low Priority" };

const item1 = new Item(itemInput1);
const item2 = new Item(itemInput2);
const item3 = new Item(itemInput3);

jest.mock("../../repository/item.db");

const mockSaveItem = itemDb.saveItem as jest.Mock;
const mockGetItemByName = itemDb.getItemByName as jest.Mock;
const mockRemoveItem = itemDb.removeItem as jest.Mock;
const mockGetAllItems = itemDb.getAllItems as jest.Mock;

beforeEach(() => {
    jest.clearAllMocks();
});

test('given valid item input; when adding an item; then it should add the item correctly', () => {
    // given
    mockGetItemByName.mockReturnValue(undefined);
    mockSaveItem.mockReturnValue(item1);

    // when
    const addedItem = ItemService.addItem(itemInput1);

    // then
    expect(addedItem.getName()).toBe(itemInput1.name);
    expect(mockSaveItem).toHaveBeenCalledWith(expect.any(Item));
});

test('given existing item name; when adding an item; then it should throw an error', () => {
    // given
    mockGetItemByName.mockReturnValue(item1);

    // when & then
    expect(() => {
        ItemService.addItem(itemInput1);
    }).toThrow(`Item with name ${itemInput1.name} already exists.`);
});

test('given valid item name; when retrieving an item; then it should return the item', () => {
    // given
    mockGetItemByName.mockReturnValue(item1);

    // when
    const retrievedItem = ItemService.getItem(itemInput1.name);

    // then
    expect(retrievedItem).toBeDefined();
    expect(retrievedItem?.getName()).toBe(itemInput1.name);
    expect(mockGetItemByName).toHaveBeenCalledWith({ name: itemInput1.name });
});

test('given non-existing item name; when retrieving an item; then it should throw an error', () => {
    // given
    const nonExistingItemName = "NonExistingItem";
    mockGetItemByName.mockReturnValue(undefined);

    // when & then
    expect(() => {
        ItemService.getItem(nonExistingItemName);
    }).toThrow(`Item with name ${nonExistingItemName} does not exist.`);
});

test('given valid item name; when removing an item; then it should remove the item', () => {
    // given
    mockGetItemByName.mockReturnValue(item1);

    // when
    ItemService.removeItem(itemInput1.name);

    // then
    expect(mockRemoveItem).toHaveBeenCalledWith(itemInput1.name);
});

test('given non-existing item name; when removing an item; then it should throw an error', () => {
    // given
    const nonExistingItemName = "NonExistingItem";
    mockGetItemByName.mockReturnValue(undefined);

    // when & then
    expect(() => {
        ItemService.removeItem(nonExistingItemName);
    }).toThrow(`Item with name ${nonExistingItemName} does not exist.`);
});

test('when retrieving all items; then it should return all items', () => {
    // given
    mockGetAllItems.mockReturnValue([item1, item2, item3]);

    // when
    const allItems = ItemService.getAllItems();

    // then
    expect(allItems.length).toBe(3);
    expect(mockGetAllItems).toHaveBeenCalled();
});