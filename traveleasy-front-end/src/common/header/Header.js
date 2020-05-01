import React, {useState} from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Home from '@material-ui/icons/Home';
import Categories from './Categories'
import {useHistory} from "react-router-dom";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import LoginPage from "../../user/loginPage";
import {ACCESS_TOKEN} from '../../constants';
import CartDrawer from "../drawers/cart/CartDrawer";
import UserDrawer from "../drawers/user/UserDrawer";
import {useDispatch, useSelector} from "react-redux";

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
    const [openCart, setOpenCart] = useState(false);
    const [openUser, setOpenUser] = useState(false);
    const history = useHistory();
    const [openLogin, setOpenLogin] = React.useState(false);

    const currentUser = useSelector(state => state.currentUserReducer);

    let onMouseEnter = ()=> {

        if(!showCategories && !window.location.href.includes("/activities")){
            setShowCategories(true);
            setTimeout(()=>  setShowCategories(false), 3000);
        }
    };

    let onActivityClick = (event) =>{
        event.preventDefault();
        history.push("/services");

    };

    let onHomeClick = (event) =>{
        event.preventDefault();
        history.push("/");
    };

    let onProfileClick = () =>{
        setOpenUser(!openUser);
    };


    let onCartClick = (event) =>{
        event.preventDefault();
        console.log("onCartClick");
        setOpenCart(!openCart);
    };

    let onCartClose = (event) =>{
        event.preventDefault();
        console.log("onCartClick");
        setOpenCart(false);
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
                        Services
                    </Typography>
                    {currentUser ? /*TODO: Change to redux */
                        <div>
                            <IconButton edge="start" className={classes.homeButton}
                                        color="inherit" aria-label="menu"
                                        onClick={(event =>{ onCartClick(event)}) }>
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

            <CartDrawer open={openCart} handleClose={onCartClick}/>
            <UserDrawer open={openUser} handleClose={onProfileClick}/>
        </div>
    );
}
