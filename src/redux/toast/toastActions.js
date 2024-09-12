import { ADD_TOAST, REMOVE_TOAST } from './toastTypes'

export const addToast = (message, type, duration = 5000) => {
    return {
        type: ADD_TOAST,
        payload: {
            id: Date.now(),
            message,
            type,
            duration,
        }
    }
}

export const removeToast = (id) => {
    return {
        type: REMOVE_TOAST,
        payload: {
            id,
        }
    }
}