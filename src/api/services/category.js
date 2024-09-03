import { get, post, put, del } from '../apiClient';
import { API_CATEGORY, API_CATEGORIES } from '../apiConstants/category'

// GET categories
export const getAllCategories = async (params) => {
    return await get(API_CATEGORIES, params)
}

export const getCategoryById = async (id) => {
    return await get(`${API_CATEGORY}/${id}`);
}


// CREATE category
export const createCategory = async (category) => {
    return await post(API_CATEGORY, category);
}


// UPDATE category
export const updateCategory = async (id, category) => {
    return await put(`${API_CATEGORY}/${id}`, category);
}


// DELETE category
export const removeCategory = async (id) => {
    return await del(`${API_CATEGORY}/${id}`);
}
