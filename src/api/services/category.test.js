import { getAllCategories, getCategoryById, createCategory, updateCategory, removeCategory } from './category';
import { get, post, put, del } from '../apiClient';
import { API_CATEGORIES, API_CATEGORY } from '../apiConstants/category';

jest.mock('../apiClient', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    del: jest.fn(),
}))

jest.mock('../apiConstants/category', () => ({
    API_CATEGORIES: '/api/categories',
    API_CATEGORY: '/api/category',
}))

describe('Category API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('fetche categories', async () => {
        const mockesResponse = {
            content: [
                { id: 1, name: 'Fiction' },
                { id: 2, name: 'Non-Fiction' },
            ],
            size: 5,
            totalPages: 1,
        }

        get.mockResolvedValue(mockesResponse);
        const page = 0;
        const size = 5;
        const search = '';

        const response = await getAllCategories({ page, size, search });

        expect(get).toHaveBeenCalledWith(
            API_CATEGORIES,
            { page, size, search }
        );

        expect(response).toEqual(mockesResponse);

    })

    test('fetches category by id', async () => {
        const mockResponse = {
            id: 1,
            name: "Fiction"
        }

        get.mockResolvedValue(mockResponse);
        const id = 1;

        const response = await getCategoryById(id);
        expect(get).toHaveBeenCalledWith(
            `${API_CATEGORY}/${id}`
        );

        expect(response).toEqual(mockResponse);
    })

    test('creates category', async () => {
        const mockResponse = {
            status: "200 OK",
            message: "Category created successfully"
        }

        post.mockResolvedValue(mockResponse);
        const category = { name: "History" };

        const response = await createCategory(category);
        expect(post).toHaveBeenCalledWith(
            API_CATEGORY,
            category
        );

        expect(response).toEqual(mockResponse);
    })

    test('update category', async () => {
        const mockResponse = {
            status: "200 OK", 
            message: "Category updated successfully"
        }

        put.mockResolvedValue(mockResponse);
        const id = 1;
        const category = { name: "Fiction Updated" };

        const response = await updateCategory(id, category);

        expect(put).toHaveBeenCalledWith(
            `${API_CATEGORY}/${id}`, 
            category
        )

        expect(response).toEqual(mockResponse);
    })

    test('remove category', async () => {
        const mockResponse = {
            status: "200 OK",
            message: "Category deleted successfully"
        }

        del.mockResolvedValue(mockResponse);
        const id = 1;

        const response = await removeCategory(id);

        expect(del).toHaveBeenCalledWith(`${API_CATEGORY}/${id}`);
        expect(response).toEqual(mockResponse);
        
    })

});