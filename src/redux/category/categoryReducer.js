import { ADD_CATEGORY, DELETE_CATEGORY, SET_CATEGORIES, UPDATE_CATEGORY } from './categoryTypes'

const initialState = [];

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CATEGORIES:
            return action.payload

        case ADD_CATEGORY:
            return [...state, action.payload]

        case DELETE_CATEGORY:
            return state.filter((category) => category.id != action.payload);

        case UPDATE_CATEGORY: 
            return state.map((category) =>
                category.id === action.payload.id       
                    ? { ...category, ...action.payload }  
                    : category
            )
            
        default:
            return state
    }
}

export default categoryReducer;