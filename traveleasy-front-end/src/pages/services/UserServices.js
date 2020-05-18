import React, {useEffect, useState} from "react";
import { getUserServices} from '../../utils/APIUtils';
import {useParams} from "react-router-dom";
import {getServices,getUserServicesEvents} from '../../utils/APIUtils';
import Service from "../../components/service";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import {useSelector} from "react-redux";

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
export default function UserServices() {

    const [services, setServices] = useState([]);
    const [state, forceState] = useState([]);
    const classes = useStyles();
    const currentUser = useSelector(state => state.currentUserReducer);

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
                                     CheckUserClicked={true}/>
                        </ul>
                    </li>

                )
            )
        }
        else return null;
    };


    let mappedServices;
    useEffect(() => {
        let id2 = id;
        if(typeof id === 'undefined'){
            id2 = 2;
            if( currentUser !== null) {
                id2 = currentUser.id
            }
        }
        getUserServices(id2).then(r => {
            setServices(r);
        })

    }, [currentUser]);


    if(typeof services !== 'undefined'){
        mappedServices = mapServices();
    }

    return(
        <div className={classes.center}>
            <p>Services:</p>

                <List className={classes.root} subheader={<li />}>
                    {services ? mappedServices : null}
                </List>

        </div>

    );

}