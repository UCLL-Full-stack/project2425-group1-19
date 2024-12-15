import Item from "../../model/item";
import {Urgency} from "../../types";

// Global constants for valid inputs
const validName = "Test item";
const validDescription = "This is a test item";
const validPrice = 100;
const validStringUrgency:Urgency = "High Priority";
// const validNumberUrgency = 3;

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
    expect(newItem.getUrgency()).toBe("Not a Priority");
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
        new Item({ name: validName, description: validDescription, price: validPrice, urgency: invalidUrgency as any});
    }).toThrow('Invalid urgency value');
});

// test('given valid urgency number; when creating an item; then it should convert the number to corresponding string', () => {
//     // given
//     // (global constants are used)

//     // when
//     const newItem = new Item({ name: validName, description: validDescription, price: validPrice, urgency: validNumberUrgency });

//     // then
//     expect(newItem.getUrgency()).toBe(validStringUrgency);
// });

// test('given invalid urgency number; when creating an item; then it should throw an error', () => {
//     // given
//     const invalidUrgencyNumber = 5;

//     // when & then
//     expect(() => {
//         new Item({ name: validName, description: validDescription, price: validPrice, urgency: invalidUrgencyNumber });
//     }).toThrow('Invalid urgency value');
// });