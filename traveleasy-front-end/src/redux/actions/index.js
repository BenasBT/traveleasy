export const setUser = (user) =>{
    return{
        type:'SIGN_IN',
        curentuser: user
    }
};

export const clearUser = () =>{
    return{
        type:'SIGN_OUT',
    }
};

export const setCalendarAction = (calendar) =>{
    return{
        type:'CALENDAR',
        calendar: calendar
    }
};

export const setFilter = (filter) =>{
    return{
        type:'FILTER',
        filter: filter
    }
};