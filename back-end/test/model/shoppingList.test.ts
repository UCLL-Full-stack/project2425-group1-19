import ShoppingList from "../../model/shoppingList";
import Item from "../../model/item";


//TODO: ADD tests for owner and privacy

// Global constants for valid inputs
const validListName = "Test List";
const item1 = new Item({ name: "Item 1", description: "Description 1", price: 10, urgency: "high" });
const item2 = new Item({ name: "Item 2", description: "Description 2", price: 20, urgency: "low" });
const validItems = [item1, item2];

test('given valid ListName and items; when creating a ShoppingList; then it should create the ShoppingList correctly', () => {
    // given
    // (global constants are used)

    // when
    const newList = new ShoppingList({ ListName: validListName, items: validItems });

    // then
    expect(newList.getListName()).toBe(validListName);
    expect(newList.getListItems()).toEqual(validItems);
});

test('given no ListName and valid items; when creating a ShoppingList; then it should create the ShoppingList with default ListName', () => {
    // given
    // (global constants are used)

    // when
    const newList = new ShoppingList({ items: validItems });

    // then
    expect(newList.getListName()).toBe("General list");
    expect(newList.getListItems()).toEqual(validItems);
});

test('given valid ListName and no items; when creating a ShoppingList; then it should create the ShoppingList with empty items array', () => {
    // given
    // (global constants are used)

    // when
    const newList = new ShoppingList({ ListName: validListName });

    // then
    expect(newList.getListName()).toBe(validListName);
    expect(newList.getListItems()).toEqual([]);
});

test('given no ListName and no items; when creating a ShoppingList; then it should create the ShoppingList with default ListName and empty items array', () => {
    // given
    // (global constants are used)

    // when
    const newList = new ShoppingList({});

    // then
    expect(newList.getListName()).toBe("General list");
    expect(newList.getListItems()).toEqual([]);
});

test('given invalid ListName; when creating a ShoppingList; then it should throw an error', () => {
    // given
    const invalidListName = 123 as any;

    // when & then
    expect(() => {
        new ShoppingList({ ListName: invalidListName, items: validItems });
    }).toThrow('Invalid ListName value');
});

test('given empty ListName; when creating a ShoppingList; then it should throw an error', () => {
    // given
    const emptyListName = "";

    // when & then
    expect(() => {
        new ShoppingList({ ListName: emptyListName, items: validItems });
    }).toThrow('Invalid ListName value');
});

test('given ListName longer than 40 characters; when creating a ShoppingList; then it should throw an error', () => {
    // given
    const longListName = "a".repeat(41);

    // when & then
    expect(() => {
        new ShoppingList({ ListName: longListName, items: validItems });
    }).toThrow('Invalid ListName value');
});

test('given invalid items; when creating a ShoppingList; then it should throw an error', () => {
    // given
    const invalidItems = "invalid" as any;

    // when & then
    expect(() => {
        new ShoppingList({ ListName: validListName, items: invalidItems });
    }).toThrow('Invalid items value');
});

test('given items array with invalid item; when creating a ShoppingList; then it should throw an error', () => {
    // given
    const invalidItemsArray = [item1, "invalid" as any];

    // when & then
    expect(() => {
        new ShoppingList({ ListName: validListName, items: invalidItemsArray });
    }).toThrow('Invalid item in items array');
});

test('given valid item; when adding an item; then it should add the item to the list', () => {
    // given
    const newList = new ShoppingList({ ListName: validListName, items: validItems });
    const newItem = new Item({ name: "Item 3", description: "Description 3", price: 30, urgency: "low" });

    // when
    newList.addItem(newItem);

    // then
    expect(newList.getListItems()).toContain(newItem);
});

test('given invalid item; when adding an item; then it should throw an error', () => {
    // given
    const newList = new ShoppingList({ ListName: validListName, items: validItems });
    const invalidItem = "invalid" as any;

    // when & then
    expect(() => {
        newList.addItem(invalidItem);
    }).toThrow('Invalid item');
});

test('given existing item name; when removing an item; then it should remove the item from the list', () => {
    // given
    const newList = new ShoppingList({ ListName: validListName, items: validItems });

    // when
    newList.removeItem("Item 1");

    // then
    expect(newList.getListItems().find(item => item.getName() === "Item 1")).toBeUndefined();
});

test('given non-existing item name; when removing an item; then it should not change the list', () => {
    // given
    const newList = new ShoppingList({ ListName: validListName, items: validItems });

    // when
    newList.removeItem("Non-existing Item");

    // then
    expect(newList.getListItems()).toEqual(validItems);
});