import {createStore,combineReducers} from 'redux';
import currentUserReducer from './currentUser'
import calendarReducer from "./calendar";
import filterReducer from "./filter"


const rootReducer = combineReducers({
    currentUserReducer,
    calendarReducer,
    filterReducer
});

export default rootReducer;