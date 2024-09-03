import { del, get, post, put } from '../apiClient';
import { API_BOOK, API_BOOKS, API_BOOK_HISTORY } from '../apiConstants/book';

// GET books
export const getAllBooks = async(params) => {
    return await get(API_BOOKS, params);
}

export const getBookById = async(id) => {
    return await get(`${API_BOOK}/${id}`)
}


// CREATE book
export const createBook = async (book) => {
    return await post(API_BOOK, book);
}


// UPDATE book
export const updateBook = async (id, book) => {
    return await put(`${API_BOOK}/${id}`, book);
}


// DELETE book
export const removeBook = async (id) => {
    return await del(`${API_BOOK}/${id}`);
}


// BOOK History
export const getBookHistory = async (id, params) => {
    return await get(`${API_BOOK_HISTORY}/${id}`, params);
}

