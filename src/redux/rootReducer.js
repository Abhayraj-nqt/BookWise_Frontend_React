import { combineReducers } from 'redux'
import authReducer from './auth/authReducer'
import toastReducer from './toast/toastReducer'

const rootReducer = combineReducers({
    toast: toastReducer,
    auth: authReducer,
})

export default rootReducer;