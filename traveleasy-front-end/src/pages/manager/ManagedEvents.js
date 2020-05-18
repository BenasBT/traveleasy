import React, {useEffect, useState} from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import {getManagedPurchases, deletePurchaseEvent} from "../../utils/APIUtils";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";

const useStyles = makeStyles((theme) => ({

    root:{
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 400,

    },
    card: {
        padding: "10px",
        border: "1px solid "

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
    image:{
        margin: "auto",
        align:"center",
        "max-height": "180px",
        "max-width": "300px",
        // height: 180,
        // width: 300,

    },
    info :{
        margin:'auto',
        textAlign: 'center',
        width: '50%'
    },

}));
export default function ManagedEvents() {

    const [events, setEvents] = useState([]);
    const classes = useStyles();
    const [thumb, setThumb] = useState(0);
    const [state, forceState] = useState(false);

    let nextPhoto = (event) =>{

        if(thumb < event.service.service_photo.length -1){
            setThumb(thumb +1);
        }else {
            setThumb(0);
        }

    };

    let onCancelClick = (e,event) => {
        e.preventDefault();
        console.log("cancel event");
        let tempEvent  =  events.find((e) => e.id === event.id);
        deletePurchaseEvent(event.id).then((r) => {
            let index = events.indexOf(tempEvent);
            if (index > -1) {
                events.splice(index, 1);
            }
            forceState(!state);
        });

    };

    let ServicesMedia = (event,photo) =>{

        return  (
            <CardMedia className={classes.image}
                       component="img"
                       alt={photo.name}
                       image={"http://localhost:3001/api/photo/" + photo.id}
                       title={photo.name}
                       onClick={() => nextPhoto(event)}
            />
        )
    };

    let categories = (event) =>{

        return  (
            event.service.service_category.filter((category => category.valid))
                .map( category => (
                    <Grid item xs={6}>
                        <Card>
                            <CardActionArea>
                                {category.name}
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))
        )
    };

    let mappedEvents =() =>{
            return events.map((event,index) => (

                    <li key={index} className={classes.listSection}>
                        <ul className={classes.ul}>
                        <Card className={classes.card}>
                            <CardActions>
                                {event.service.service_photo.length> 0 ? ServicesMedia(event,event.service.service_photo[thumb]) : null}
                            </CardActions>

                            <CardContent className={classes.info} >
                                <Typography gutterBottom variant="body1" component="h2" >
                                    {event.service.name}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {event.service.description}
                                </Typography>
                                <Divider   />
                                <Typography gutterBottom variant="body2" component="h2">
                                    Price: {event.service.price} &euro; per {event.service.price_type}
                                </Typography>
                                <Typography gutterBottom variant="body2" component="h2">
                                    Full Price: {event.price} &euro;
                                </Typography>
                                <Divider   />
                                Categories:
                                <Grid container spacing={3}>
                                    {categories(event)}
                                </Grid>
                                <Divider   />

                                {event.start_date ?
                                    <Typography variant="body2" gutterBottom>
                                        Start Date: {event.start_date}
                                    </Typography> : null}
                                {event.end_date ?
                                    <Typography variant="body2" gutterBottom>
                                        End Date: {event.end_date}
                                    </Typography> : null}

                                {event.start_time ?
                                    <Typography variant="body2" gutterBottom>
                                        Start Time: {event.start_time}
                                    </Typography>: null}
                                {event.end_time ?
                                    <Typography variant="body2" gutterBottom>
                                        End Time: {event.end_time}
                                    </Typography> : null}

                                {event.people_count !== 0 ?
                                    <Typography variant="body2" gutterBottom>
                                        People:  {event.people_count !== 0 ?  `${event.people_count}`
                                        : null}
                                    </Typography>
                                    :null}
                                <Divider/>
                                <Typography variant="body2" gutterBottom>
                                    {event.user.email ? <Typography variant="body2" gutterBottom>
                                       Contact Email: {event.user.email}
                                    </Typography> : null}
                                    {event.user.phone ?<Typography variant="body2" gutterBottom>
                                        Contact Phone: {event.user.phone}
                                    </Typography> : null}
                                </Typography>

                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" onClick={e => onCancelClick(e,event)}>
                                    Cancel Event
                                </Button>
                            </CardActions>
                        </Card>
                        </ul>
                    </li>
            ))

    };

    useEffect(() => {

        getManagedPurchases().then(r => {
            setEvents(r);
        })

    }, []);

    return (
        <div>
            <p>Managed Events: </p>
            <List className={classes.root} subheader={<li />}>
                {events.length > 0 ? mappedEvents() : <p>test</p>}

            </List>
        </div>

    );
}