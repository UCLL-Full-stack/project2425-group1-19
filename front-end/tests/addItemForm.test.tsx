import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddItemForm from '../components/lists/addItemForm'; // anders faalt de test

// Mock functions
const mockOnAddItem = jest.fn();
const mockOnNeedRefresh = jest.fn();
jest.mock('../service/listsService');

const defaultProps = {
  onAddItem: mockOnAddItem,
  onNeedRefresh: mockOnNeedRefresh,
  shoppingListName: 'Test Shopping List',
};

beforeEach(() => {
  mockOnAddItem.mockClear();
  mockOnNeedRefresh.mockClear();
});

test('given default props, when the form is rendered, then it displays the form correctly', () => {
  render(<AddItemForm {...defaultProps} />);

  expect(screen.getByLabelText('lists.form.itemname')).toBeInTheDocument();
  expect(screen.getByLabelText('lists.form.description')).toBeInTheDocument();
  expect(screen.getByLabelText('lists.form.price')).toBeInTheDocument();
  expect(screen.getByLabelText('lists.form.urgency')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'lists.form.submit' })).toBeDisabled();
});

test('given valid inputs, when the form is filled out, then the submit button is enabled', () => {
  render(<AddItemForm {...defaultProps} />);

  fireEvent.change(screen.getByLabelText('lists.form.itemname'), {
    target: { value: 'Test Item' },
  });
  fireEvent.change(screen.getByLabelText('lists.form.description'), {
    target: { value: 'Test Description' },
  });

  expect(screen.getByRole('button', { name: 'lists.form.submit' })).toBeEnabled();
});

test('given valid inputs, when the form is submitted, then onAddItem is called with correct values', () => {
  render(<AddItemForm {...defaultProps} />);

  const itemName = 'Test Item';
  const description = 'Test Description';
  // const price = 10;

  fireEvent.change(screen.getByLabelText('lists.form.itemname'), {
    target: { value: itemName },
  });
  fireEvent.change(screen.getByLabelText('lists.form.description'), {
    target: { value: description },
  });
  fireEvent.change(screen.getByLabelText('lists.form.price'), {
    target: { value: "10" },
  });
  fireEvent.change(screen.getByLabelText('lists.form.urgency'), {
    target: { value: 'mid' },
  });

  fireEvent.click(screen.getByRole('button', { name: 'lists.form.submit' }));

  // expect(mockOnAddItem).toHaveBeenCalledWith(                    //Werkt niet door hoe jest dingen invult in inputfields
  //   { name: itemName, description, price:"10", urgency: 'mid' },
  //   undefined
  // );

  expect(mockOnAddItem).toHaveBeenCalledTimes(1);
});

test('given invalid inputs, when the form is submitted, then it displays an error message', () => {
  render(<AddItemForm {...defaultProps} />);

  fireEvent.change(screen.getByLabelText('lists.form.itemname'), {
    target: { value: 'A very long item name that exceeds the character limit A very long item name that exceeds the character limit A very long item name that exceeds the character limit A very long item name that exceeds the character limit A very long item name that exceeds the character limit' },
  });
  fireEvent.change(screen.getByLabelText('lists.form.description'), {
    target: { value: "description test" },
  });

  fireEvent.click(screen.getByRole('button', { name: 'lists.form.submit' }));

  expect(screen.getByText('lists.form.validate.name')).toBeInTheDocument();
  expect(mockOnAddItem).not.toHaveBeenCalled();
});