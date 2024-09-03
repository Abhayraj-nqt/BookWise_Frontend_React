import { combineReducers } from 'redux'
import authReducer from './auth/authReducer'
import toastReducer from './toast/toastReducer'
import categoryReducer from './category/categoryReducer'

const rootReducer = combineReducers({
    toast: toastReducer,
    auth: authReducer,
    categories:categoryReducer, 
})

export default rootReducer;