import {createStore,combineReducers} from 'redux';
import currentUserReducer from './currentUser'
import categoryReducer from "./category";


const rootReducer = combineReducers({
    currentUserReducer,
    categoryReducer
});

export default rootReducer;