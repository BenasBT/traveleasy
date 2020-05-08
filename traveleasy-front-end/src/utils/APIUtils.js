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
export const getUser = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/user/"+ id,{headers});
        const user = res.data;
        return user;
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

export const addServiceToEvents = async (addRequest) =>{
    try {
        const headers = {
            'Authorization':localStorage.getItem(ACCESS_TOKEN)
        };
        const res = await apiClient.post("/scheduler/add",addRequest,{headers});
        let responce = res;

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

    }catch (e) {
        console.log(e);
        console.log("Error adding service");
    }

};

export const addServiceFiles = async (addRequestFiles) =>{
    try {
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


export const getUserServices = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/service/user/"+ id,{headers});
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


export const deleteService = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.delete("/service/"+id,{headers});
        return res.data;
    }catch (e) {
        console.log(e);
        console.log("Error login");
    }
    return null;

};

export const getScheduler = async () =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/scheduler/",{headers});
        console.log(res);
        return res.data;

    }catch (e) {
        console.log(e);
        console.log("Error login");
    }
    return null;

};


export const SenddeleteEvent = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.delete("/scheduler/delete/" + id,{headers});
        console.log(res);
        return res.data;

    }catch (e) {
        console.log(e);
        console.log("Error login");
    }
    return null;

};

export const SendEditEvent = async (editRequest) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.patch("/scheduler/edit",editRequest,{headers});
        console.log(res);
        return res.data;

    }catch (e) {
        console.log(e);
        console.log("Error login");
    }
    return null;

};

export const getEvent = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.patch("/scheduler/"+ id,{headers});
        console.log(res);
        return res.data;

    }catch (e) {
        console.log(e);
        console.log("Error login");
    }
    return null;

}