import React, {useEffect, useState} from "react";
import {getServices} from '../../utils/APIUtils';
import Service from "../../components/service";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Filter from "../../common/drawers/filter/Filter";
import {useSelector} from "react-redux";

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

export default function AdminServices() {


    const [services, setServices] = useState([]);
    const [state, forceState] = useState([]);
    const classes = useStyles();
    const filterState = useSelector(state => state.filterReducer);

    let checkCategories =(categories)=>{
        if (typeof filterState.categories === 'undefined'){
            return true
        }
        let apliedCategories = [];
        categories.forEach((cat) =>{
            apliedCategories.push(filterState.categories.find((f) => {
                if(f.name === "Other"){
                    if (cat.valid === false){
                        return true
                    }
                }
                return cat.id === f.id
            }));
        });

        let good = false;
        apliedCategories.forEach((c) => {
            if(typeof c !== 'undefined'){
                good = true;
            }
        });

        return good
    };

    let filter = (services) =>{
        let filteredServices = services.filter( (service) => {
            if(service.status === 'ACTIVE'){
                return false
            }
            if(filterState.min_price !== "" && service.price < filterState.min_price){
                return false;
            }
            if(filterState.max_price !== "" && service.price > filterState.max_price){
                return false;
            }
            if(!checkCategories(service.service_category)){
                return false
            }
            if(filterState.min_people_count !== ""
                && service.min_people_count !== 0
                && service.min_people_count < filterState.min_people_count){
                return false;
            }
            if(filterState.max_people_count !== ""
                && service.max_people_count !== 0
                && service.max_people_count < filterState.max_people_count){
                return false;
            }

            let filterDate = new Date(filterState.start_date);
            let serviceDate = new Date(service.end_date);

            if(filterState.start_date !== ""
                && serviceDate.getTime() !== 0
                && filterDate.getTime() > serviceDate.getTime()){
                return false
            }

            filterDate = new Date(filterState.end_date);
            serviceDate = new Date(service.start_date);

            if(filterState.end_date !== ""
                && serviceDate.getTime() !== 0
                && filterDate.getTime() < serviceDate.getTime()){
                return false
            }


            if( typeof filterState.start_time !== "undefined"
                && filterState.start_time !== ""
                && service.end_time !== null) {

                let filerTimeParts = filterState.start_time.split(":");
                let serviceimeParts = service.end_time.split(":");
                if (filerTimeParts[0] > serviceimeParts[0]) {
                    return false;
                }else if(filerTimeParts[0] === serviceimeParts[0]){
                    if(filerTimeParts[1] > serviceimeParts[1]){
                        return false
                    }
                }
            }

            if( typeof filterState.end_time !== "undefined"
                && filterState.end_time !== ""
                && service.start_time !== null) {

                let filerTimeParts = filterState.end_time.split(":");
                let serviceimeParts = service.start_time.split(":");

                if (filerTimeParts[0] < serviceimeParts[0]) {
                    return false;
                }else if(filerTimeParts[0] === serviceimeParts[0]){
                    if(filerTimeParts[1] < serviceimeParts[1]){
                        return false
                    }
                }
            }


            return true;
        });
        return filteredServices;
    };

    let mapServices = () =>{
        if(services){

            let filteredServices = filter(services);

            return filteredServices.map(
                (ser) => (

                    <li key={`section-${ser.id}`} className={classes.listSection}>
                        <ul className={classes.ul}>
                            <Service service={ser}
                                     servicesState={services}
                                     ps={state} fs={forceState} admin={true}/>
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


    return(
        <div className={classes.center}>
            <List className={classes.root} subheader={<li />}>
                {services ? mapServices() : null}
            </List>



        </div>

    );

}