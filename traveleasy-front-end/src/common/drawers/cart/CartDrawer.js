import React, {useState} from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import EditEvent from "../../../components/event/EditEvent";
import {getScheduler, SendEditEvent} from "../../../utils/APIUtils";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import Checkout from "../../../components/checkout/Checkout";
import ViewEvent from "../../../components/event/ViewEvent";


const useStyles = makeStyles(theme => ({
    list: {
        width: 250,

    }
}));

// TODO: Pakeisti i kortas
export default function CartDrawer ({open,handleClose,events,deleteEvent,editEvent,deleteEvents,currentUser}) {

    const [selectedEvent, setSelectedEvent] = useState({});
    const [openEditEvent, setOpenEditEvent] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [viewEvent, setViewEvent] = useState(false);

    const classes = useStyles();
    const sideList =
        <div
            className={classes.list}
        >
            {events  ?(
                <List>
                {events.map((event, index) => (
                    <div>
                        <ListItem  key={index}>
                            <ListItem button onClick={e=> onViewEvent(e,event)} >
                                <ListItemText primary={event.service.name} />
                            </ListItem>

                            <IconButton aria-label="delete" color="primary" onClick={e => openEdit(e,event)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton aria-label="delete" color="primary" onClick={e=> deleteEvent(e,event)} >
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                        <Divider/>
                    </div>


                ))}

            </List>): null }


        </div>
    ;

    let closeEventEdit = (event) =>{
        setOpenEditEvent(false);

    };

    let openEdit = (e,event) =>{
        e.preventDefault();
        setSelectedEvent(event);
        setOpenEditEvent(true);

    };
    let openCheckout = (e) => {

        setCheckoutOpen(true);
    };

    let closeCheckout = (e) =>{
        setCheckoutOpen(false)
    };
    let onViewEvent = (e,event) =>{
        e.preventDefault();
        console.log("event view");
        setSelectedEvent(event);
        setViewEvent(true);

    };

    let closeEventView = (e) =>{
        e.preventDefault();
        setViewEvent(false);

    };

    let onEditClick = (e) =>{
        e.preventDefault();
        setViewEvent(false);
        setOpenEditEvent(true);
    };

    let fullPrice =() =>{
        let price = 0;
        events.forEach((event) => {price += event.price});
        return price;
    };

    let deleteEventWrapper = (e,event) =>{
        e.preventDefault();
        console.log("Close");
        setViewEvent(false);
        deleteEvent(e,event);

    };

    return(
        <div>

            <Drawer anchor='right' open={open} onClose={handleClose}>
                {sideList}

                Full Price: {fullPrice()}
                <Button color="primary"
                        variant="contained"
                        onClick={openCheckout}
                >Checkout</Button>
            </Drawer>



            <Checkout events={events}
                      open={checkoutOpen}
                      handleClose={closeCheckout}
                      deleteEvents={deleteEvents} price={fullPrice()}/>

            <ViewEvent event={selectedEvent} open={viewEvent} handleClose={event => closeEventView(event)}
                       currentUser={currentUser} onDeleteClick={deleteEventWrapper} onEditClick={onEditClick} />

            <EditEvent event={selectedEvent} open={openEditEvent}
                       handleClose={closeEventEdit}
                       deleteEvent={deleteEvent} editEvent={editEvent} />

        </div>

    )
}