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
import EventIcon from '@material-ui/icons/Event';
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay';
import {getScheduler, SendEditEvent} from "../../utils/APIUtils";
import Filter from "../../pages/services/Filter";
import SearchIcon from '@material-ui/icons/Search';

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

    const [openSearch, setOpenSearch] = useState(false);
    const history = useHistory();
    const [openLogin, setOpenLogin] = useState(false);

    const [events, setEvents] = useState(false);

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

    let onShedulerClick = (event) =>{
        event.preventDefault();
        history.push("/scheduler");

    };

    let onHomeClick = (event) =>{
        event.preventDefault();
        history.push("/");
    };

    let onProfileClick = () =>{
        setOpenUser(!openUser);
    };

    let onSearchClick = () =>{
        setOpenSearch(!openSearch);
    };


    let onCartClick = (event) =>{
        event.preventDefault();
        getScheduler().then((events) => setEvents(events));
        setOpenCart(!openCart);
    };
    let deleteEvent = (e,id) =>{
        e.preventDefault();
        console.log(id);
    };

    let SubmitEditEvent = (e,event,fixedDate,sDate,sTime,eDate,eTime,pplCnt) =>{
        e.preventDefault();
        console.log("SubmitEditEvent");
        const editRequest = {

            id:event.id,
            service:event.service,

            fixed_date:fixedDate,
            start_date: sDate,
            start_time:sTime,

            end_date:eDate,
            end_time:eTime,

            people_count: pplCnt
        };


        if(pplCnt === ''){
            editRequest.people_count =0;
        }
        if(sTime === null){
            editRequest.start_date = "";
        }
        if(sDate === null){
            editRequest.start_date = "";
        }
        if(eDate === null){
            editRequest.end_date = "";
        }
        if(eTime === null){
            editRequest.end_time = "";
        }
        if(fixedDate){
            console.log("fixedDate");
            editRequest.end_date = "";
            editRequest.end_time = "";
        }

        console.log(editRequest);
        SendEditEvent(editRequest).then(() =>{
            getScheduler().then((events) => setEvents(events));

        });
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

                    <IconButton edge="start" className={classes.homeButton}
                                color="inherit" aria-label="menu"
                                onClick={onSearchClick}>
                        <SearchIcon />  {/*TODO: change icon*/}
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
                                        onClick={(event =>{ onShedulerClick(event)}) }>
                                <EventIcon />
                            </IconButton>
                            <IconButton edge="start" className={classes.homeButton}
                                        color="inherit" aria-label="menu"
                                        onClick={(event =>{ onCartClick(event)}) }>
                                <CalendarViewDayIcon />
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

            <Filter open={openSearch} handleClose={onSearchClick}/>

            <LoginPage  open={openLogin} handleClose={onCloseLogin}/>

            <CartDrawer open={openCart} handleClose={onCartClick}
                        events={events}
                        deleteEvent={deleteEvent} editEvent={SubmitEditEvent}/>

            <UserDrawer open={openUser} handleClose={onProfileClick}/>
        </div>
    );
}
