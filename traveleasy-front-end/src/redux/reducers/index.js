import {createStore,combineReducers} from 'redux';
import currentUserReducer from './currentUser'


const rootReducer = combineReducers({
    currentUserReducer,
});

export default rootReducer;