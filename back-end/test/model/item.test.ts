import Item from "../../model/item";
import { Urgency } from "../../types";

// Global constants for valid inputs
const validName = "Test item";
const validDescription = "This is a test item";
const validPrice = 100;
const validStringUrgency: Urgency = "high";

test('given valid values; when creating an item; then it should create the item correctly', () => {
    // given
    // (global constants are used)

    // when
    const newItem = new Item({ name: validName, description: validDescription, price: validPrice, urgency: validStringUrgency });

    // then
    expect(newItem.getName()).toBe(validName);
    expect(newItem.description).toBe(validDescription);
    expect(newItem.getPrice()).toBe(validPrice);
    expect(newItem.getUrgency()).toBe(validStringUrgency);
});

test('given valid name, description, and no urgency; when creating an item; then it should create the item with default urgency', () => {
    // given
    // (global constants are used)

    // when
    const newItem = new Item({ name: validName, description: validDescription, price: validPrice });

    // then
    expect(newItem.getName()).toBe(validName);
    expect(newItem.description).toBe(validDescription);
    expect(newItem.getPrice()).toBe(validPrice);
    expect(newItem.getUrgency()).toBe("low");
});

test('given invalid name; when creating an item; then it should throw an error', () => {
    // given
    const invalidName = 123 as any;

    // when & then
    expect(() => {
        new Item({ name: invalidName, description: validDescription, price: validPrice, urgency: validStringUrgency });
    }).toThrow('Invalid name value');
});

test('given name longer than 40 characters; when creating an item; then it should throw an error', () => {
    // given
    const longName = "a".repeat(41);

    // when & then
    expect(() => {
        new Item({ name: longName, description: validDescription, price: validPrice, urgency: validStringUrgency });
    }).toThrow('Invalid name value');
});

test('given invalid description; when creating an item; then it should throw an error', () => {
    // given
    const invalidDescription = 123 as any;

    // when & then
    expect(() => {
        new Item({ name: validName, description: invalidDescription, price: validPrice, urgency: validStringUrgency });
    }).toThrow('Invalid description value');
});

test('given description longer than 240 characters; when creating an item; then it should throw an error', () => {
    // given
    const longDescription = "a".repeat(241);

    // when & then
    expect(() => {
        new Item({ name: validName, description: longDescription, price: validPrice, urgency: validStringUrgency });
    }).toThrow('Invalid description value');
});

test('given invalid price; when creating an item; then it should throw an error', () => {
    // given
    const invalidPrice = '100' as any;

    // when & then
    expect(() => {
        new Item({ name: validName, description: validDescription, price: invalidPrice, urgency: validStringUrgency });
    }).toThrow('Invalid price value');
});

test('given negative price; when creating an item; then it should throw an error', () => {
    // given
    const negativePrice = -100;

    // when & then
    expect(() => {
        new Item({ name: validName, description: validDescription, price: negativePrice, urgency: validStringUrgency });
    }).toThrow('Invalid price value');
});

test('given invalid urgency string; when creating an item; then it should throw an error', () => {
    // given
    const invalidUrgency = 'Very Urgent';

    // when & then
    expect(() => {
        new Item({ name: validName, description: validDescription, price: validPrice, urgency: invalidUrgency as any });
    }).toThrow('Invalid urgency value');
});

test('given valid data; when creating an item from static method; then it should create the item correctly', () => {
    // given
    const data = { name: validName, description: validDescription, price: validPrice, urgency: validStringUrgency };

    // when
    const newItem = Item.from(data);

    // then
    expect(newItem.getName()).toBe(validName);
    expect(newItem.description).toBe(validDescription);
    expect(newItem.getPrice()).toBe(validPrice);
    expect(newItem.getUrgency()).toBe(validStringUrgency);
});

test('given valid item; when getting name; then it should return the name', () => {
    // given
    const newItem = new Item({ name: validName, description: validDescription, price: validPrice, urgency: validStringUrgency });

    // when
    const name = newItem.getName();

    // then
    expect(name).toBe(validName);
});

test('given valid item; when getting price; then it should return the price', () => {
    // given
    const newItem = new Item({ name: validName, description: validDescription, price: validPrice, urgency: validStringUrgency });

    // when
    const price = newItem.getPrice();

    // then
    expect(price).toBe(validPrice);
});

test('given valid item with no price; when getting price; then it should return 0', () => {
    // given
    const newItem = new Item({ name: validName, description: validDescription });

    // when
    const price = newItem.getPrice();

    // then
    expect(price).toBe(0);
});

test('given valid item; when getting urgency; then it should return the urgency', () => {
    // given
    const newItem = new Item({ name: validName, description: validDescription, price: validPrice, urgency: validStringUrgency });

    // when
    const urgency = newItem.getUrgency();

    // then
    expect(urgency).toBe(validStringUrgency);
});

test('given valid item with no urgency; when getting urgency; then it should return default urgency', () => {
    // given
    const newItem = new Item({ name: validName, description: validDescription, price: validPrice });

    // when
    const urgency = newItem.getUrgency();

    // then
    expect(urgency).toBe("low");
});
