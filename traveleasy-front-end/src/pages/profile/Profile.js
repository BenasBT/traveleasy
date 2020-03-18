import React from "react";
import {useParams} from 'react-router-dom'
export default function Profile() {
    console.log("Profile");
    //Picture if exist else some defoult picture
    //Display data
    let { id } = useParams();
    return(
        <p>Profile Page of user {id}</p>

    );

}