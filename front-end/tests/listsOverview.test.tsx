import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ListsOverview from '../components/lists/listsOverview'; // ../ is nodig anders faalt de test
import { getShoppingLists } from '../service/listsService';
import { ShoppingList } from '../types/index';

// Mock the service functions
jest.mock('../service/listsService');
jest.mock('process', () => ({
    env: {
        backendUrl: 'http://localhost:3000'
    }
}));

const mockGetShoppingLists = jest.fn();
(getShoppingLists as jest.MockedFunction<typeof getShoppingLists>) = mockGetShoppingLists;

beforeEach(() => {
    jest.clearAllMocks();
});

// Test: Given no shopping lists, when the component renders, then it shows no lists found message
test('given no shopping lists, when the component renders, then it shows no lists found message', async () => {
    mockGetShoppingLists.mockResolvedValueOnce([]);

    render(<ListsOverview />);

    await waitFor(() => {
        expect(screen.getByText('No lists found')).toBeInTheDocument();
    });
});

// Test: Given shopping lists, when the component renders, then it shows the lists and the number of items in each list
test('given shopping lists, when the component renders, then it shows the lists and the number of items in each list', async () => {
    const shoppingLists: ShoppingList[] = [
        {
            ListName: "Weekly Groceries",
            items: [
                { name: "Apples", description: "Delicious red apples", price: 3.99, urgency: "high" },
                { name: "Bananas", description: "Fresh yellow bananas", price: 1.99, urgency: "low" }
            ],
            privacy: "public",
            owner: "GeneralUser"
        },
        {
            ListName: "Party Supplies",
            items: [
                { name: "Chips", description: "Crunchy potato chips", price: 2.99, urgency: "mid" },
                { name: "Soda", description: "Refreshing soda drinks", price: 4.99, urgency: "high" },
                { name: "Plastic Cups", description: "Pack of 50 plastic cups", price: 3.99, urgency: "mid" },
                { name: "Napkins", description: "Pack of 100 napkins", price: 1.99, urgency: "low" }
            ],
            privacy: "adultOnly",
            owner: "GeneralUser"
        }
    ];

    mockGetShoppingLists.mockResolvedValueOnce(shoppingLists);

    render(<ListsOverview />);

    await waitFor(() => {
        // Check that the lists are displayed
        expect(screen.getByText('Weekly Groceries')).toBeInTheDocument();
        expect(screen.getByText('Party Supplies')).toBeInTheDocument();
        
        // Check that the number of items for each list is correct
        expect(screen.getByText('2')).toBeInTheDocument(); // Number of items in 'Weekly Groceries'
        expect(screen.getByText('4')).toBeInTheDocument(); // Number of items in 'Party Supplies'
    });
});
