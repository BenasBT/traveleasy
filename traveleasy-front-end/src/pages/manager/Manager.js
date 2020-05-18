import React from "react";
import {useSelector} from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import UserServices from "../services/UserServices";
import ManagedEvents from "./ManagedEvents";

const useStyles = makeStyles((theme) => ({

    root:{
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 400,

    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {

        backgroundColor: 'inherit',
        padding: 0,
        align:"center"
    },
    center:{
        margin: "auto",
    },
    p_root: {
        maxWidth: 345,
    },

}));

export default function Manager() {

    const currentUser = useSelector(state => state.currentUserReducer);
    const classes = useStyles();


    return(
        <div>
            <p>Manager Page</p>
            <UserServices/>
            <ManagedEvents/>
        </div>


    );

}