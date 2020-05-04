import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from '../constants';
import apiClient from './apiClient.js'
import {setUser} from "../redux/actions/index";


export const login = async ({password,email}) =>{
    try {
        const res = await apiClient.post("/auth/login",{email,password});
        let token = res.data.accessToken;

        localStorage.setItem(ACCESS_TOKEN,"Bearer " + token); // TODO: change to redux

    }catch (e) {
        console.log(e);
        console.log("Error login");
    }

};

export const getCurrentUser = async (dispatch) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/user/me",{headers});
        const user = res.data;
        dispatch(setUser(user))
    }catch (e) {
        console.log(e);
        console.log("Error login");
    }
    return null;

};


export const register = async ({name,email,password}) =>{
    try {
        const res = await apiClient.post("/auth/register",{name,email,password});
        await login({password, name: name});

    }catch (e) {
        console.log(e);
        console.log("Error login");
    }

};

export const getAllCategories = async () =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/category",{headers});
        return res.data;
    }catch (e) {
        console.log(e);
        console.log("Error login");
    }
    return null;

};

export const addService = async (addRequest) =>{
    try {
        const headers = {
            'Authorization':localStorage.getItem(ACCESS_TOKEN)
        };
        const res = await apiClient.post("/service/add",addRequest,{headers});
        let responce = res;
        console.log(responce);

    }catch (e) {
        console.log(e);
        console.log("Error adding service");
    }

};

export const editService = async (editRequest) =>{
    try {
        const headers = {
            'Authorization':localStorage.getItem(ACCESS_TOKEN)
        };
        const res = await apiClient.patch("/service/edit",editRequest,{headers});
        let responce = res;
        console.log(responce);

    }catch (e) {
        console.log(e);
        console.log("Error adding service");
    }

};

export const addServiceFiles = async (addRequestFiles) =>{
    try {
        console.log(addRequestFiles);

        const headers = {
            'Authorization':localStorage.getItem(ACCESS_TOKEN)
        };
        const res = await apiClient.post("/service/add",addRequestFiles,{headers});
        let responce = res;

    }catch (e) {
        console.log(e);
        console.log("Error adding service");
    }

};


export const getMyServices = async () =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/service/my",{headers});
        return res.data;
    }catch (e) {
        console.log(e);
        console.log("Error login");
    }
    return null;

};

export const getServices = async () =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/service/",{headers});
        return res.data;
    }catch (e) {
        console.log(e);
        console.log("Error login");
    }
    return null;

};

export const getService = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/service/"+id,{headers});
        return res.data;
    }catch (e) {
        console.log(e);
        console.log("Error login");
    }
    return null;

};

export const getPhoto = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        // const res =await apiClient.get("/photo/" + id,{headers});
        const res =await apiClient.get("/photo/" + id,{headers});
        return res.data;
    }catch (e) {
        console.log(e);
        console.log("Error login");
    }
    return null;

};

export const deletePhoto = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        // const res =await apiClient.get("/photo/" + id,{headers});
        const res =await apiClient.delete("/photo/" + id,{headers});
        return res.data;
    }catch (e) {
        console.log(e);
        console.log("Error login");
    }
    return null;

};