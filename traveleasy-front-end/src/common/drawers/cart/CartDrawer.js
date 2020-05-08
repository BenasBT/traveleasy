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


const useStyles = makeStyles(theme => ({
    list: {
        width: 250,

    }
}));

// TODO: Pakeisti i kortas
export default function CartDrawer ({open,handleClose,events,deleteEvent,editEvent}) {

    const [selectedEvent, setSelectedEvent] = useState({});
    const [openEditEvent, setOpenEditEvent] = useState(false);

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


    return(
        <div>

            <Drawer anchor='right' open={open} onClose={handleClose}>
                {sideList}
            </Drawer>

            <EditEvent event={selectedEvent} open={openEditEvent}
                       handleClose={closeEventEdit}
                       deleteEvent={deleteEvent} editEvent={editEvent} />

        </div>

    )
}