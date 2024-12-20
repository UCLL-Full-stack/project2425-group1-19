import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddItemForm from '@/components/lists/addItemForm';
import { Item } from '@/types';

// Mock functions
const mockOnAddItem = jest.fn();
const mockOnNeedRefresh = jest.fn();

describe('AddItemForm', () => {
  const defaultProps = {
    onAddItem: mockOnAddItem,
    onNeedRefresh: mockOnNeedRefresh,
    shoppingListName: 'Test Shopping List',
  };

  beforeEach(() => {
    mockOnAddItem.mockClear();
    mockOnNeedRefresh.mockClear();
  });

  it('renders the form correctly', () => {
    render(<AddItemForm {...defaultProps} />);

    expect(screen.getByText(/Add an Item to the shoppingList/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Urgency/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Item/i })).toBeDisabled();
  });

  it('enables the submit button when the form is valid', () => {
    render(<AddItemForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Item Name/i), {
      target: { value: 'Test Item' },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Test Description' },
    });

    expect(screen.getByRole('button', { name: /Add Item/i })).toBeEnabled();
  });

  it('calls onAddItem with correct values when the form is submitted', () => {
    render(<AddItemForm {...defaultProps} />);

    const itemName = 'Test Item';
    const description = 'Test Description';
    const price = 10;

    fireEvent.change(screen.getByLabelText(/Item Name/i), {
      target: { value: itemName },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: description },
    });
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: price.toString() },
    });
    fireEvent.change(screen.getByLabelText(/Urgency/i), {
      target: { value: 'mid' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));

    expect(mockOnAddItem).toHaveBeenCalledWith(
      { name: itemName, description, price, urgency: 'mid' },
      undefined
    );
  });

  it('displays an error message for invalid inputs', () => {
    render(<AddItemForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Item Name/i), {
      target: { value: 'A very long item name that exceeds the character limit' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));

    expect(screen.getByText(/Invalid name value/i)).toBeInTheDocument();
    expect(mockOnAddItem).not.toHaveBeenCalled();
  });
});
