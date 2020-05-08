const calendarReducer = (state = [], action) =>{

    switch(action.type){
        case 'CALENDAR':
            return action.calendar;
        default:
            return state
    }
};

export default calendarReducer;