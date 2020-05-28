import React, {useEffect, useState} from "react";
import { getUserServices} from '../../utils/APIUtils';
import {useParams} from "react-router-dom";
import {getMarkedService} from '../../utils/APIUtils';
import Service from "../../components/service";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import AppBar from "@material-ui/core/AppBar";
import {Typography} from "@material-ui/core";

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

}));
export default function MarkedServices() {

    const [services, setServices] = useState([]);
    const [state, forceState] = useState(false);
    const classes = useStyles();

    let {id} = useParams();

    let mapServices = () =>{
        if(services){
            return services.map(
                (ser) => (

                    <li key={`section-${ser.id}`} className={classes.listSection}>
                        <ul className={classes.ul}>
                            <Service service={ser}
                                     servicesState={services}
                                     ps={state} fs={forceState}
                                     marked={true}/>
                        </ul>
                    </li>

                )
            )
        }
        else return null;
    };

    let mappedServices;
    useEffect(() => {
        getMarkedService(id).then(r => {
            setServices(r);
        })

    }, []);


    if(typeof services !== 'undefined'){
        mappedServices = mapServices();
    }
    return(
        <div className={classes.center}>
            <AppBar position={"relative"}>
                <Typography align="center" variant="h6" >
                    Marked:
                </Typography>
            </AppBar>
            <List className={classes.root} subheader={<li />}>
                {services ? mappedServices : null}
            </List>
        </div>

    );

}