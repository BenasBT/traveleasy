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
