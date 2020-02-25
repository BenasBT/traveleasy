const curentUserReducer = (state = null, action) =>{    
    switch(action.type){
        case 'SIGN_IN':
            return action.curentuser;
        case 'SIGN_OUT':
            return null;
        default:
            return state
    }
}

export default curentUserReducer;