import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from '../constants';
import apiClient from './apiClient.js'
import {setUser} from "../redux/actions/index";
import swal from "sweetalert";


export const login = async ({password,email}) =>{
    try {
        const res = await apiClient.post("/auth/login",{email,password});
        let token = res.data.accessToken;

        localStorage.setItem(ACCESS_TOKEN,"Bearer " + token); // TODO: change to redux
        swal ("Ok","" ,  "success" );
    }catch (e) {
        console.log(e);
        swal ("Ups","Something went wrong" , "error" );
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
    }

};

export const getAllCategories = async () =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/category",{headers});
        console.log(res.data);
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
        swal ("Ok","Event added" ,  "success" );

    }catch (e) {
        swal ("Ups","Cant add event, chosen date is taken" ,  "error" );
        console.log(e);
    }

};

export const editService = async (editRequest) =>{
    try {
        const headers = {
            'Authorization':localStorage.getItem(ACCESS_TOKEN)
        };
        const res = await apiClient.patch("/service/edit",editRequest,{headers});
        let responce = res;
        swal ("Ok","Service information changed" ,  "success" );
    }catch (e) {
        swal ("Ups","Cant edit service" ,  "error" );
        console.log(e);
    }

};

export const addServiceFiles = async (addRequestFiles) =>{
    try {
        const headers = {
            'Authorization':localStorage.getItem(ACCESS_TOKEN)
        };
        const res = await apiClient.post("/service/add",addRequestFiles,{headers});
        let responce = res;
        swal ("Ok","Service added" ,  "success" );
    }catch (e) {
        console.log(e);
        swal ("Ups","Cant add service" ,  "error" );
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
        swal ("Ok","Service deleted" ,  "success" );
        return res.data;

    }catch (e) {
        console.log(e);
        console.log("Error login");
        swal ("Ups","Cant delete service" ,  "error" );
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
        swal ("Ok","Event deleted" ,  "success" );
        return res.data;

    }catch (e) {
        swal ("Ups","Can't delete Event" ,  "error" );

        console.log("Error login");
    }
    return null;

};
export const SendDeleteEvents = async () =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.delete("/scheduler/delete/",{headers});
        console.log(res);
        swal ("Ok","Event deleted" ,  "success" );

        return res.data;

    }catch (e) {
        console.log(e);
        swal ("Ups","Can't delete Event" , "error" );

    }
    return null;

};
export const SendEditEvent = async (editRequest) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.patch("/scheduler/edit",editRequest,{headers});
        console.log(res);
        swal ("Ok","Event edited" ,  "success" );
        return res.data;

    }catch (e) {
        console.log(e);
        swal ("Ups","Something went wrong" , "error" );
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
    }
    return null;

};

export const getPriceTypes = async () =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/service/prices",{headers});
        console.log(res);
        return res.data;

    }catch (e) {
        console.log(e);

    }
    return null;

};

export const markService = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/service/mark/" + id,{headers});
        console.log(res);
        swal ("Ok","Service marked" ,  "success" );

    }catch (e) {
        console.log(e);
        console.log("Error login");
        swal ("Ups","Cant mark service" ,  "error" );
    }
    return null;

};

export const unmarkService = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/service/unmark/" + id,{headers});
        swal ("Ok","Service unmarked " ,  "success" );

        console.log(res);

    }catch (e) {
        console.log(e);
        swal ("Ups","Something went wrong" , "error" );
    }
    return null;

};


export const getMarkedService = async () =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/service/marked/" ,{headers});
        return res.data;

    }catch (e) {
        console.log(e);
        console.log("Error login");
    }
    return null;

};

export const approveService = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/service/approve/" + id ,{headers});
        swal ("Ok","Service approved " ,  "success" );
        return res.data;

    }catch (e) {
        console.log(e);
        swal ("Ups","Something went wrong" , "error" );

    }
    return null;

};

export const denyService = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/service/deny/" + id ,{headers});
        swal ("Ok","Service denied " ,  "success" );
        return res.data;

    }catch (e) {
        console.log(e);
        swal ("Ups","Something went wrong" , "error" );

    }
    return null;
};

export const approveCategory = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("/category/approve/" + id ,{headers});
        swal ("Ok","Category approved " ,  "success" );
        return res.data;

    }catch (e) {
        console.log(e);
        swal ("Ups","Something went wrong" , "error" );

    }
    return null;

};

export const deleteCategory = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.delete("/category/" + id ,{headers});
        console.log(res);
        swal ("Ok","Category deleted " ,  "success" );
        return res.data;

    }catch (e) {
        console.log(e);
        swal ("Ups","Something went wrong" , "error" );
    }
    return null;
};

export const sendCheckout = async (checkoutRequest) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.post("checkout/",checkoutRequest ,{headers});
        console.log(res);
        swal ("Ok","events registered" ,  "success" );

        return res.data;

    }catch (e) {
        console.log(e);
        swal ("Ups","Cant mark service" ,  "error" );

    }
    return null;
};

export const getUserArchive = async () =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("checkout/" ,{headers});
        console.log(res);
        return res.data;

    }catch (e) {
        console.log(e);

    }
    return null;
};

export const getManagedPurchases = async () =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("checkout/managed/" ,{headers});
        console.log(res);
        return res.data;

    }catch (e) {
        console.log(e);
        console.log("Error login");
    }
    return null;
};

export const getUserPurchases = async () =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.get("checkout/purchases/" ,{headers});
        console.log(res);
        return res.data;

    }catch (e) {
        console.log(e);
        console.log("Error login");
    }
    return null;
};

export const deletePurchase = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.delete("checkout/purchase/" + id ,{headers});
        swal ("Ok","Order removed" ,  "success" );
        return res.data;

    }catch (e) {
        console.log(e);
        swal ("Ups","Something went wrong" , "error" );

    }
    return null;
};

export const deletePurchaseEvent = async (id) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        const res =await apiClient.delete("checkout/" + id ,{headers});
        console.log(res);
        swal ("Ok","Event canceled" ,  "success" );
        return res.data;

    }catch (e) {
        console.log(e);
        swal ("Ups","Something went wrong" , "error" );

    }
    return null;
};



export const editUserDate = async (editUserDate) =>{
    try {
        const headers = {'Authorization':localStorage.getItem(ACCESS_TOKEN) };
        console.log(editUserDate);
        const res =await apiClient.patch("user/",editUserDate ,{headers});
        console.log(res);
        swal ("Ok","Successfully edited data" ,  "success" );

        return res.data;

    }catch (e) {
        console.log(e);
        console.log("Error login");
        swal ("Ups","Something went wrong" , "error" );

    }
    return null;
};
