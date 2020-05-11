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


const useStyles = makeStyles(theme => ({
    list: {
        width: 250,

    }
}));

// TODO: Pakeisti i kortas
export default function CartDrawer ({open,handleClose,events,deleteEvent,editEvent,deleteEvents}) {

    const [selectedEvent, setSelectedEvent] = useState({});
    const [openEditEvent, setOpenEditEvent] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);

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

                            <ListItemText primary={event.service.name} />
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
        console.log(event);
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


    return(
        <div>

            <Drawer anchor='right' open={open} onClose={handleClose}>
                {sideList}

                <Button color="primary"
                        variant="contained"
                        onClick={openCheckout}
                >Checkout</Button>
            </Drawer>



            <Checkout events={events}
                      open={checkoutOpen}
                      handleClose={closeCheckout}
                      deleteEvents={deleteEvents}/>

            <EditEvent event={selectedEvent} open={openEditEvent}
                       handleClose={closeEventEdit}
                       deleteEvent={deleteEvent} editEvent={editEvent} />

        </div>

    )
}