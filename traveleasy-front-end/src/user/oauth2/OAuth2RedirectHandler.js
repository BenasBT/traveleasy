import React, { Component } from 'react';
import { ACCESS_TOKEN } from '../../constants';
import {Redirect, useHistory} from 'react-router-dom'
import {getCurrentUser} from "../../utils/APIUtils";
import {useDispatch} from "react-redux";

export default function OAuth2RedirectHandler() {
    const history = useHistory();
    const dispatch = useDispatch();
    let getUrlParameter = (name) => {

        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

        var results = regex.exec(history.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const token = getUrlParameter('token');
    const error = getUrlParameter('error');


        if(token) {
            localStorage.setItem(ACCESS_TOKEN, "Bearer " + token);
            getCurrentUser(dispatch).then(() => history.push("/"));
        }
         else {
             console.log(error);
             history.push("/activities");

        }


         return(<h1>Redirect Page</h1>);

}

