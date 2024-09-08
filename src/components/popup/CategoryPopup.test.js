import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { validateAlphabet, validateMinLength, validateNotEmpty } from '../../libs/utils';
import CategoryPopup from './CategoryPopup';
import userEvent from '@testing-library/user-event';

jest.mock('../../libs/utils', () => ({
    validateAlphabet: jest.fn(),
    validateMinLength: jest.fn(),
    validateNotEmpty: jest.fn()
}));

describe('CategoryPopup component', () => {
    const mockOnAdd = jest.fn();
    const mockOnEdit = jest.fn();
    const mockClosePopup = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders with default props', () => {
        render(
            <CategoryPopup
                isPopupOpen={true}
                closePopup={mockClosePopup}
                onAdd={mockOnAdd}
                onEdit={mockOnEdit}
                title="Test Title"
            />
        );

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter category name')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    test('renders with edit type and shows update button', () => {
        render(
            <CategoryPopup
                isPopupOpen={true}
                closePopup={mockClosePopup}
                onAdd={mockOnAdd}
                onEdit={mockOnEdit}
                title="Edit Category"
                type="edit"
            />
        );

        expect(screen.getByText('Edit Category')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();

    });

    test('handles input change and validation errors', async () => {
        validateNotEmpty.mockImplementation(() => false);
        validateMinLength.mockImplementation(() => true);
        validateAlphabet.mockImplementation(() => true);

        render(
            <CategoryPopup
                isPopupOpen={true}
                closePopup={mockClosePopup}
                onAdd={mockOnAdd}
                onEdit={mockOnEdit}
                title="Test Title"
            />
        );

        const input = screen.getByPlaceholderText('Enter category name');
        const addButton = screen.getByRole('button', { name: 'Save' });

        userEvent.type(input, '');
        userEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByText(`Category name can't be empty`)).toBeInTheDocument();
        });


    });

    test('calls onAdd with correct data when Add button is clicked', async () => {
        validateNotEmpty.mockImplementation(() => true);
        validateMinLength.mockImplementation(() => true);
        validateAlphabet.mockImplementation(() => true);

        render(
            <CategoryPopup
                isPopupOpen={true}
                closePopup={mockClosePopup}
                onAdd={mockOnAdd}
                onEdit={mockOnEdit}
                title="Add Category"
            />
        );

        const input = screen.getByPlaceholderText('Enter category name');
        const addButton = screen.getByRole('button', { name: 'Save' });

        userEvent.type(input, 'New Category');
        userEvent.click(addButton);

        await waitFor(() => {
            expect(mockOnAdd).toHaveBeenCalledWith({ id: '', name: 'New Category' });
            expect(mockClosePopup).toHaveBeenCalled();
        });
    });

    test('calls onEdit with correct data when Update button is clicked', async () => {
        validateNotEmpty.mockImplementation(() => true);
        validateMinLength.mockImplementation(() => true);
        validateAlphabet.mockImplementation(() => true);

        render(
            <CategoryPopup
                isPopupOpen={true}
                closePopup={mockClosePopup}
                onAdd={mockOnAdd}
                onEdit={mockOnEdit}
                title="Edit Category"
                type="edit"
                category={{ id: '1', name: 'Existing Category' }}
            />
        );

        const input = screen.getByPlaceholderText('Enter category name');
        fireEvent.change(input, { target: { value: 'Updated Category' } });

        const updateButton = screen.getByRole('button', { name: 'Update' });
        userEvent.click(updateButton);

        await waitFor(() => {
            expect(mockOnEdit).toHaveBeenCalledWith({ id: '1', name: 'Updated Category' });
            expect(mockClosePopup).toHaveBeenCalled();
        });
    });

    test('resets data and errors when popup is closed', async () => {
        const { rerender } = render(
            <CategoryPopup
                isPopupOpen={true}
                closePopup={mockClosePopup}
                onAdd={mockOnAdd}
                onEdit={mockOnEdit}
                title="Test Title"
                type='Add'
            />
        );

        fireEvent.change(screen.getByPlaceholderText('Enter category name'), { target: { value: 'Added Category' } });
        expect(screen.getByPlaceholderText('Enter category name').value).toBe('Added Category');

        rerender(
            <CategoryPopup
                isPopupOpen={false}
                closePopup={mockClosePopup}
                onAdd={mockOnAdd}
                onEdit={mockOnEdit}
                title="Test Title"
                type='Add'
            />
        );

        await waitFor(() => {
            expect(screen.queryByPlaceholderText('Enter category name')).toBeNull();
        });

        rerender(
            <CategoryPopup
                isPopupOpen={true}
                closePopup={mockClosePopup}
                onAdd={mockOnAdd}
                onEdit={mockOnEdit}
                title="Test Title"
                type='Add'
            />
        );

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Enter category name').value).toBe('');
        });

        expect(screen.queryByText(`Category name can't be empty`)).toBeNull();
    });
})

