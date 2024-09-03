import { get, post, put, del } from '../apiClient'
import { API_ADMIN_STATISTICS } from '../apiConstants/dashboard'

export const getStatistics = async () => {
    return await get(API_ADMIN_STATISTICS);
}
