import React, {useState} from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Home from '@material-ui/icons/Home';
import Categories from './categories'
import {useHistory} from "react-router-dom";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Login from "../login";
import LoginPage from "../../pages/loginPage";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    homeButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Header(){

    const classes = useStyles();
    const [showCategories, setShowCategories] = useState(false);
    const [isLoged, setIsLoged] = useState(false);
    const history = useHistory();
    const [openLogin, setOpenLogin] = React.useState(false);




    let onMouseEnter = ()=> {

        if(!showCategories && !window.location.href.includes("/activities")){
            console.log("SHOW");
            setShowCategories(true);
            setTimeout(()=>  setShowCategories(false), 3000);
        }
    };

    let onActivityClick = (event) =>{
        event.preventDefault();
        history.push("/activities");

    };

    let onHomeClick = (event) =>{
        event.preventDefault();
        history.push("/");
    };

    let onProfileClick = (event) =>{
        event.preventDefault();
        console.log("onProfileClick");
    };


    let onCartClick = (event) =>{
        event.preventDefault();
        console.log("onCartClick");
    };

    let onLoginClick = (event) =>{
        event.preventDefault();
        console.log("onLoginClick");
        setOpenLogin(true);
    };

    let onCloseLogin = (event) =>{
        event.preventDefault();
        console.log("onCloseLogin");
        setOpenLogin(false);
    };


    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>

                    <IconButton edge="start" className={classes.homeButton}
                                color="inherit" aria-label="menu"
                    onClick={onHomeClick}>
                        <Home />  {/*TODO: change icon*/}
                    </IconButton>

                    <Typography align="center" variant="h6" className={classes.title}
                                onClick={onActivityClick}
                                onMouseEnter={onMouseEnter}>
                        Activities
                    </Typography>
                    {isLoged ?
                        <div>
                            <IconButton edge="start" className={classes.homeButton}
                                        color="inherit" aria-label="menu"
                                        onClick={onCartClick}>
                                <ShoppingCartIcon />
                            </IconButton>
                            <IconButton edge="start" className={classes.homeButton}
                                        color="inherit" aria-label="menu"
                                        onClick={onProfileClick}>
                                <AccountCircleIcon />
                            </IconButton>
                        </div>
                        :
                        <div>
                            <Button onClick={onLoginClick} color="inherit">Login</Button>
                        </div>
                    }

                </Toolbar>
            </AppBar>
            <Categories show={showCategories} />

            <LoginPage  open={openLogin} handleClose={onCloseLogin}/>
        </div>
    );
}
