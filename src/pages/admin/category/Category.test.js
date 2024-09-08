import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import Category from './Category';
import DashboardHOC from '../../../components/hoc/dashboardHOC/DashboardHOC';
import toast from '../../../components/toast/toast';

// // Functions
import { getAllCategories, createCategory, removeCategory, updateCategory } from '../../../api/services/category';

jest.mock('../../../api/services/category', () => ({
    getAllCategories: jest.fn(),
    createCategory: jest.fn(),
    removeCategory: jest.fn(),
    updateCategory: jest.fn(),
}));

jest.mock('../../../components/toast/toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

const WrappedCategory = DashboardHOC(Category);

describe('Category component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders search bar and add button', async () => {
        await act(async () => {
            render(<WrappedCategory setLoading={jest.fn()} rowCount={5} />);
        })

        expect(screen.getByPlaceholderText('Search category')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    test('fetches and displays categories', async () => {

        getAllCategories.mockResolvedValue({
            content: [
                { id: 1, name: 'Fiction' },
                { id: 2, name: 'Non-Fiction' },
            ],
            totalPages: 1,
        });

        await act(async () => {
            render(<WrappedCategory setLoading={jest.fn()} rowCount={5} />);
        })

        await waitFor(() => expect(getAllCategories).toHaveBeenCalledTimes(1));

        const fictionCategory = await screen.findByText('Fiction');
        const nonFictionCategory = await screen.findByText('Non-Fiction');

        expect(fictionCategory).toBeInTheDocument();
        expect(nonFictionCategory).toBeInTheDocument();

    });

    test('creates a new category', async () => {
        createCategory.mockResolvedValue({ message: 'Category created successfully' });
        getAllCategories.mockResolvedValue({
            content: [
                { id: 1, name: 'Fiction' },
                { id: 2, name: 'Non-Fiction' },
                { id: 3, name: 'History' },
            ],
            totalPages: 1,
        });

        await act(async () => {
            render(<WrappedCategory setLoading={jest.fn()} rowCount={5} />);
        })

        fireEvent.click(screen.getByText('Add'));
        await waitFor(() => screen.getByRole('button', { name: 'Save' }));
        fireEvent.change(screen.getByPlaceholderText('Enter category name'), { target: { value: 'Politics' } });
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => expect(createCategory).toHaveBeenCalledWith({ name: 'Politics' }));
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Category created successfully'));

        getAllCategories.mockResolvedValue({
            content: [
                { id: 1, name: 'Fiction' },
                { id: 2, name: 'Non-Fiction' },
                { id: 3, name: 'History' },
                { id: 4, name: 'Politics' },
            ],
            totalPages: 1,
        });

        await waitFor(() => expect(screen.getByText('Politics')).toBeInTheDocument());
    });

    test('updates an existing category', async () => {
        updateCategory.mockResolvedValue({ message: 'Category updated successfully' });
        getAllCategories.mockResolvedValue({
            content: [
                { id: 1, name: 'Fiction' },
                { id: 2, name: 'Non-Fiction' },
                { id: 3, name: 'History' },
                { id: 4, name: 'Politics' },
            ],
            totalPages: 1,
        });

        await act(async () => {
            render(<WrappedCategory setLoading={jest.fn()} rowCount={5} />);
        })

        await waitFor(() => fireEvent.click(screen.getByTestId('edit-icon-1')));
        await waitFor(() => screen.getByRole('button', { name: 'Update' }));
        fireEvent.change(screen.getByPlaceholderText('Enter category name'), { target: { value: 'Fiction Updated' } });
        fireEvent.click(screen.getByText('Update'));

        await waitFor(() => expect(updateCategory).toHaveBeenCalledWith(1, { name: 'Fiction Updated' }));
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Category updated successfully'));

        getAllCategories.mockResolvedValue({
            content: [
                { id: 1, name: 'Fiction Updated' },
                { id: 2, name: 'Non-Fiction' },
                { id: 3, name: 'History' },
                { id: 4, name: 'Politics' },
            ],
            totalPages: 1,
        });

        await waitFor(() => expect(screen.getByText('Fiction Updated')).toBeInTheDocument());
    });

    test('deletes a category', async () => {
        removeCategory.mockResolvedValue({ message: 'Successfully deleted' });
        getAllCategories.mockResolvedValue({
            content: [
                { id: 1, name: 'Fiction' },
                { id: 2, name: 'Non-Fiction' },
                { id: 3, name: 'History' },
                { id: 4, name: 'Politics' },
            ],
            totalPages: 1,
        });

        await act(async () => {
            render(<WrappedCategory setLoading={jest.fn()} rowCount={5} />);
        })

        await waitFor(() => fireEvent.click(screen.getByTestId(`delete-icon-1`)));
        await waitFor(() => fireEvent.click(screen.getByRole('button', { name: 'Confirm' })));

        await waitFor(() => expect(removeCategory).toHaveBeenCalledWith(1));
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Successfully deleted'));

        getAllCategories.mockResolvedValue({
            content: [
                { id: 2, name: 'Non-Fiction' },
                { id: 3, name: 'History' },
                { id: 4, name: 'Politics' },
            ],
            totalPages: 1,
        });

        await waitFor(() => expect(screen.queryByText('Fiction')).not.toBeInTheDocument());
    });


})
