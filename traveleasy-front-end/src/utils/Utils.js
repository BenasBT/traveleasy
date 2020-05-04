
export const isAdmin = (currentUser) => {
    if(currentUser) {
        let a = currentUser.roleEntities;
        for(let i = 0; i < currentUser.roleEntities.length; i ++){
            if(a[i].name === 'ROLE_ADMIN')
                return true;
        }
    }
    return false;
};