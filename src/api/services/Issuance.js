import { get, post, put, del } from '../apiClient';
import { API_ISSUANCE, API_ISSUANCES, API_ISSUANCES_BY_MOBILE } from '../apiConstants/issuance'

// GET issuance
export const getAllIssuances = async (params) => {
    return await get(API_ISSUANCES, params);
}

export const getIssuanceById = async (id) => {
    return get(`${API_ISSUANCE}/${id}`);
}

export const getIssuancesByMobile = async (mobile) => {
    return await get(`${API_ISSUANCES_BY_MOBILE}/${mobile}`);
}


// CREATE issuance
export const createIssuance = async (issuance) => {
    return await post(API_ISSUANCE, issuance);
}


// UPDATE issuance
export const updateIssuance = async (id, issuance) => {
    return await put(`${API_ISSUANCE}/${id}`, issuance);
}


// DELETE issuance
export const deleteIssuance = async (id) => {
    return await del(`${API_ISSUANCE}/${id}`);
}
