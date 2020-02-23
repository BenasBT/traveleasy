import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from '../constants';
import apiClient from './apiClient.js'


export const login = async ({password,usernameOrEmail}) =>{
    console.log(`password ${password} usernameOrEmail ${usernameOrEmail}`);
    try {
        const res = await apiClient.post("/auth/login",{usernameOrEmail,password});
        let token = res.data;
        localStorage.setItem(ACCESS_TOKEN,"Bearer " + token); // TODO: change to redux

    }catch (e) {
        console.log(e);
        console.log("Error login");
    }



};

export const register = async ({username,email,password}) =>{
    console.log(`password ${password} username ${username} email ${email}`);
    try {
        const res = await apiClient.post("/auth/register",{username,email,password});
        await login({password, usernameOrEmail: username});

    }catch (e) {
        console.log(e);
        console.log("Error login");
    }



};
