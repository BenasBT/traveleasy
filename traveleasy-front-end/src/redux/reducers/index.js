import {createStore,combineReducers} from 'redux';
import currentUserReducer from './currentUser'
import calendarReducer from "./calendar";


const rootReducer = combineReducers({
    currentUserReducer,
    calendarReducer
});

export default rootReducer;