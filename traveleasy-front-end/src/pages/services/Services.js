import React, {useEffect, useState} from "react";
import {getServices} from '../../utils/APIUtils';
import Service from "../../components/service";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Filter from "../../common/drawers/filter/Filter";

const useStyles = makeStyles((theme) => ({

    root:{
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',


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
        width: "60%",

    }
}));

export default function Services() {


    const [services, setServices] = useState([]);
    const [state, forceState] = useState([]);
    const classes = useStyles();

    let mapServices = () =>{
        if(services){
            return services.map(
                (ser) => (

                    <li key={`section-${ser.id}`} className={classes.listSection}>
                        <ul className={classes.ul}>
                                <Service service={ser}
                                         servicesState={services}
                                         ps={state} fs={forceState}/>
                        </ul>
                    </li>

                )
            )
        }
        else return null;
    };

    let mappedServices;
    useEffect(() => {
        getServices().then(r => {
            setServices(r);
        })

    }, []);

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