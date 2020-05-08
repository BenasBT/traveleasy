import React, {useEffect, useState,useRef} from "react";
import {useParams} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {Card,CardMedia,CardContent,Typography} from "@material-ui/core";
import {getScheduler, SenddeleteEvent,SendEditEvent} from '../../utils/APIUtils';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import './main.scss'
import ViewEvent from "../../components/event/ViewEvent";
import EditEvent from "../../components/event/EditEvent";
import {setUser} from "../../redux/actions"; // webpack must be configured to do this
import {setCalendarAction} from '../../redux/actions/index';

export default function Scheduler() {

    let {id} = useParams();
    const currentUser = useSelector(state => state.currentUserReducer);
    const [user, setUser] = useState([]);
    const [events, setEvents] = useState([]);
    const [viewedEvent, setViewedEvent] = useState({});
    const [viewEvent, setViewEvent] = useState(false);
    const [editEvent, setEditEvent] = useState(false);

    const [state, forceStateUpdate] = useState(false);

    const dispatch = useDispatch();

    // const [calendar, setCalendar] = useState(null);
    const calendar = useSelector(state => state.calendarReducer);


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

    let eventClick = (info) =>{
        setViewedEvent(info.event.extendedProps.event);
        setViewEvent(true);

    };
    let closeEventView = (event) =>{
        event.preventDefault();
        setViewEvent(false);

    };

    let closeEventEdit = () =>{
        setEditEvent(false);

    };

    let onDeleteClick = (e,event) =>{
        e.preventDefault();
        let tempEvent  = events.events.find((e) => e.extendedProps.event.id === event.id);

        SenddeleteEvent(event.id).then( () =>{
            let index = events.events.indexOf(tempEvent);
            if (index > -1) {
                events.events.splice(index, 1);
            }
            //REDUX
            setEvents(parseEvents(events.events));
            fullCalendar(parseEvents(events.events));
            setViewEvent(false);
         });
        // let api = calendarRef.current.getApi();

    };

    let SubmitEditEvent = (e,event,fixedDate,sDate,sTime,eDate,eTime,pplCnt) =>{
        e.preventDefault();
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
            editRequest.end_date = "";
            editRequest.end_time = "";
        }

        SendEditEvent(editRequest).then(() =>{
            getScheduler().then(events => {
                //REDUX
                setEvents(parseEvents(events));
                fullCalendar(parseEvents(events));
            });
        });
    };

    let onEditClick = (event) =>{
        event.preventDefault();
        setViewEvent(false);
        setEditEvent(true);
    };

    useEffect(() => {

        getScheduler().then(events => {
            setEvents(parseEvents(events));
            fullCalendar(parseEvents(events));

        });

    }, []);


    let fullCalendar = (events) => {
        //REDUX
        dispatch(setCalendarAction(
            <FullCalendar defaultView="dayGridMonth" plugins={[ dayGridPlugin ]}
                          events={events} eventClick={eventClick}
            />));
    };

    let Calendar = () =>{
        return calendar;
    };
    return(
        <div>
            <p>Scheduler</p>


            {calendar}

            <ViewEvent event={viewedEvent} open={viewEvent} handleClose={event => closeEventView(event)}
                       currentUser={currentUser} onDeleteClick={onDeleteClick} onEditClick={onEditClick} />

            <EditEvent event={viewedEvent} open={editEvent}
                       handleClose={closeEventEdit} editEvent={SubmitEditEvent} />

        </div>
    );

}