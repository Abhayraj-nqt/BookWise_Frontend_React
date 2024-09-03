import { ADD_TOAST, REMOVE_TOAST } from "./toastTypes";

const initialState = [];

const toastReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TOAST:
            return [...state, action.payload]

        case REMOVE_TOAST:
            return state.filter((toast) => toast.id != action.payload.id);

        default:
            return state;
    }
}

export default toastReducer;