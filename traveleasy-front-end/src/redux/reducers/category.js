const categoryReducer = (state = [], action) =>{

    switch(action.type){
        case 'CALENDAR':
            return action.calendar;
        default:
            return state
    }
};

export default categoryReducer;