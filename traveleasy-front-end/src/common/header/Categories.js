import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import makeStyles from "@material-ui/core/styles/makeStyles";
import {MuiThemeProvider,createMuiTheme} from "@material-ui/core";

const useStyles = makeStyles(theme => ({

    categories: {
        flexGrow: 1,

    },
    hidden: {
        display: 'none'
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Categories ({show}){

    const classes = useStyles();
    let CategiruesClass;
    show ?  CategiruesClass = classes.categories : CategiruesClass = classes.hidden;

    let onActivityClick = (event) =>{
        event.preventDefault();
    };
    /*TO DO: fix for too many activities*/
    return(

        <AppBar  color={"secondary"}  className={CategiruesClass} position="static">
            <Toolbar>

                <Button onClick={onActivityClick}>
                    <Typography align="center" className={classes.title}>
                        Activity 1
                    </Typography>
                </Button>


                <Typography align="center"  className={classes.title} >
                    Activity 2
                </Typography>

                <Typography align="center"  className={classes.title} >
                    Activity 3
                </Typography>




            </Toolbar>
        </AppBar>
    );
}