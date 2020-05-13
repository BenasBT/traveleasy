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
import {SenddeleteEvent, getScheduler, SendEditEvent,SendDeleteEvents} from "../../utils/APIUtils";
import Filter from "../drawers/filter/Filter";
import SearchIcon from '@material-ui/icons/Search';
import {setCalendarAction} from "../../redux/actions";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

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

    const [openLogin, setOpenLogin] = useState(false);

    const [events, setEvents] = useState([]);

    const currentUser = useSelector(state => state.currentUserReducer);
    const dispatch = useDispatch();
    const history = useHistory();
    const calendar = useSelector(state => state.calendarReducer);

    let onMouseEnter = ()=> {

        if(!showCategories && !window.location.href.includes("/activities")){
            setShowCategories(true);
            setTimeout(()=>  setShowCategories(false), 3000);
        }
    };

    let onServicesClick = (event) =>{
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
    let deleteEvent = (e,event) =>{
        e.preventDefault();
        console.log(events);
        console.log(event);

        let tempEvent  = events.find((e) => e.id === event.id);

        SenddeleteEvent(event.id).then( () =>{
            let index = events.indexOf(tempEvent);
            if (index > -1) {
                events.splice(index, 1);
            }
            //REDUX
            getScheduler().then((events) => {
                setEvents(events);
                fullCalendar(parseEvents(events));
            });

        });
        // lets api = calendarRef.current.getApi();
    };

    let deleteEvents = (e) =>{
        e.preventDefault();


        SendDeleteEvents().then( () =>{
            //REDUX
            getScheduler().then((events) => {
                setEvents([]);
                fullCalendar(parseEvents(events));
            });

        });
        // lets api = calendarRef.current.getApi();
    };


    let parseEvents = (events) =>{

        let mapped_events;
        if(typeof events[0] !== 'undefined') {
            if (typeof events[0].service !== 'undefined') {
                mapped_events = events.map((event) => (
                    {
                        title: event.service.name,
                        start: event.start_date + 'T' + event.start_time,
                        end: event.end_date + 'T' + event.end_time,
                        extendedProps: {
                            department: 'BioChemistry',
                            event: event
                        },
                        description: event.service.description
                    }))
            } else {
                mapped_events = events.map((event) => (
                    {
                        title: event.title,
                        start: event.start,
                        end: event.end,
                        extendedProps: {
                            department: 'BioChemistry',
                            event: event.extendedProps.event
                        },
                        description: event.description
                    }))
            }
        }

        let calendar = {events:mapped_events};
        return calendar;
    };


    let fullCalendar = (events) => {
        //REDUX
        if (typeof calendar.props !== "undefined") {
            dispatch(setCalendarAction(
                <FullCalendar defaultView="dayGridMonth" plugins={[dayGridPlugin]}
                              events={events} eventClick={calendar.props.eventClick}
                />));
        }
    };

    let SubmitEditEvent = (e,event) =>{
        e.preventDefault();
        const editRequest = {

            id:event.id,
            service:event.service,

            fixed_date:event.fixed_date,
            start_date: event.start_date,
            start_time:event.start_time,

            end_date:event.end_date,
            end_time:event.end_time,

            people_count: event.people_count,
            price_counter: event.price_counter
        };


        if(editRequest.people_count === ''){
            editRequest.people_count =0;
        }
        if(editRequest.price_counter === ""){
            editRequest.price_counter =0;
        }
        if(editRequest.start_date === null){
            editRequest.start_date = "";
        }
        if(editRequest.start_time === null){
            editRequest.start_time = "";
        }
        if(editRequest.end_date === null){
            editRequest.end_date = "";
        }
        if(editRequest.end_time === null){
            editRequest.end_time = "";
        }
        if(event.fixed_date){
            editRequest.end_date = "";
            editRequest.end_time = "";
        }

        console.log(editRequest);
        SendEditEvent(editRequest).then(() =>{
            getScheduler().then((events) => {
                setEvents(events);
                fullCalendar(parseEvents(events));
            });

        });
    };




    let onCartClose = (event) =>{
        event.preventDefault();
        setOpenCart(false);
    };


    let onLoginClick = (event) =>{
        event.preventDefault();
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
                                onClick={onServicesClick}
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

            <Filter open={openSearch} handleClose={onSearchClick} updateServices={onServicesClick}/>

            <LoginPage  open={openLogin} handleClose={onCloseLogin}/>

            <CartDrawer open={openCart} handleClose={onCartClick}
                        events={events}
                        deleteEvent={deleteEvent} editEvent={SubmitEditEvent} deleteEvents={deleteEvents}/>

            <UserDrawer open={openUser} handleClose={onProfileClick}/>
        </div>
    );
}
