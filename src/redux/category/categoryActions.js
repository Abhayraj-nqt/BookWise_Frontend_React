import { ADD_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY, SET_CATEGORIES } from "./categoryTypes";


export const setCategories = (categories) => {
    return {
        type: SET_CATEGORIES,
        payload: categories,
    }
}

export const addCategory = (category) => {
    return {
        type: ADD_CATEGORY,
        payload: category,
    }
}

export const deleteCategory = (id) => {
    return {
        type: DELETE_CATEGORY,
        payload: id,
    }
}

export const updateCategoryAction = (category) => {
    return {
        type: UPDATE_CATEGORY,
        payload: category,
    }
}