import React, {useEffect, useState} from "react";
import { getUserServices} from '../../utils/APIUtils';
import {useParams} from "react-router-dom";
import {getMarkedService,getUserArchive} from '../../utils/APIUtils';
import Service from "../../components/service";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import {Card, CardContent, Collapse, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const useStyles = makeStyles((theme) => ({

    root:{
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 400,

    },
    listSection: {
        backgroundColor: 'inherit',
    },
    center:{
        margin: "auto",
    },

    p_root: {
        maxWidth: 345,
    },
    archive: {
        padding: "2px",
        width: '100%',
        // border: "1px solid "
    },
    event:{
        padding: "10px",
        border: "1px solid ",
        borderRadius: 10,

    },

}));
export default function Archive() {

    const [archive, setArchive] = useState([]);
    const [state, forceState] = useState(false);
    const classes = useStyles();

    let mapEntities = (entities,show) =>{

        return entities.map((e) =>
            (<Collapse in={show} >
                <Card>
                    <CardContent>
                        <Typography variant="body2" gutterBottom>
                            Service Name: {e.service_name}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Service Description: {e.service_description}
                        </Typography>
                        {e.event_start_date !== null || e.event_end_date !== null ?
                            <Typography variant="body2" gutterBottom>
                                {"Event Date: "}
                                {e.event_start_date !== null ? ` from ${e.event_start_date}` : ""}
                                {e.event_end_date !== null ?` to: ${e.event_end_date}` : ""}
                            </Typography>
                            :
                            null}
                        {e.event_start_time !== null || e.event_end_time !== null ?
                            <Typography variant="body2" gutterBottom>
                                {"Event Time: "}
                                {e.event_start_time !== null ? ` from ${e.event_start_time}` : ""}
                                {e.event_end_time !== null ?` to: ${e.event_end_time}` : ""}
                            </Typography>
                            :
                            null}

                        <Typography variant="body2" gutterBottom>
                            {e.event_people_count !== null && e.event_people_count !== 0 ?
                                `People Count: ${e.event_people_count}` : ""}
                        </Typography>

                        <Typography gutterBottom variant="body2" component="h2">
                            Price: {e.service_price} &euro; per {e.service_price_type}
                        </Typography>
                        <Typography gutterBottom variant="body2" component="h2">
                            Event price: {e.event_price} &euro;
                        </Typography>
                    </CardContent>
                </Card>

            </Collapse>)
        )
    };

    let openData = (event,arc) => {
        event.preventDefault();
        let index = archive.indexOf(arc);
        if(index !== -1){
             archive[index].show = !archive[index].show;
        }
        forceState(!state);
    };

    let mapArchives = () =>{

        if(archive){
            return archive.map(
                (arc) => (

                <ListItem  key={`section-${arc.id}`}>
                    <Card className={classes.archive}>
                        <CardContent>
                            <ListItem button onClick={event => openData(event,arc)} >
                                <Typography variant="body2" gutterBottom>
                                    Full Price: {arc.price} &euro; Archive ID: {arc.id}
                                </Typography>
                            </ListItem>


                            {arc.show ?   <ExpandLess /> : <ExpandMore />}
                            <Divider/>
                            {mapEntities(arc.archiveEntities,arc.show)}
                        </CardContent>
                    </Card>
                </ListItem>

                )
            )
        }
        else return null;
    };

    let mappedArchive;
    useEffect(() => {
        getUserArchive().then(r => {
            setArchive(
                r.map((r) => {
                    var o = Object.assign({}, r);
                    o.show = false;
                    return o;
                }
            ));
        })

    }, []);


    if(typeof archive !== 'undefined'){
        mappedArchive = mapArchives();
    }
    return(
        <div className={classes.center}>
            <AppBar position={"relative"}>
                <Typography align="center" variant="h6" >
                    Archive
                </Typography>
            </AppBar>

            <List className={classes.root} subheader={<li />}>
                {archive ? mappedArchive : null}
            </List>
        </div>

    );

}