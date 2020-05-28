import React, {useEffect, useState} from "react";
import {getServices,getAllCategories,
    approveCategory,deleteCategory} from '../../utils/APIUtils';
import Service from "../../components/service";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Filter from "../../common/drawers/filter/Filter";
import {useSelector} from "react-redux";
import {Button, Card, CardActionArea, CardActions, CardContent, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";

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
        padding: 10,
        align:"center"
    },
    center:{
        margin: "auto",
        width: "60%",

    }
}));

export default function AdminCategories() {


    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
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

        console.log(apliedCategories);
        let good = false;
        apliedCategories.forEach((c) => {
            console.log(c);
            if(typeof c !== 'undefined'){
                good = true;
            }
        });

        return good
    };

    let filter = (services) =>{
        console.log(services);
        console.log(filterState);
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
        console.log(filteredServices);
        return filteredServices;
    };

    let onApproveClick = (e,id) =>{
        e.preventDefault();

        approveCategory(id).then(() => {
            categories.forEach( (cat, i) => {
                if(cat.id === id){
                    cat.valid = true;
                }
            } )
        });


        forceState(!state);


    };
    let onDeleteClick = (e,id) =>{
        e.preventDefault();
        deleteCategory(id).then(() =>{
            let index = -1;
            categories.forEach((cat,i) => {
                if(cat.id === id){
                    index=i;
                }
            });

            if (index > -1) {
                categories.splice(index, 1);
            }
        });

        forceState(!state);

    };

    let mapCategories = () =>{
        if(categories){

            console.log(categories);
            return categories.filter(cat => cat.name !=='Other').map(
                (cat) => (

                    <li key={`section-${cat.id}`} className={classes.listSection}>
                        <ul className={classes.ul}>
                            <Card>
                                <Typography gutterBottom variant="h5" component="h2" >
                                    {cat.name}
                                </Typography>
                                    {cat.valid ? "Approved" : "Pending" }
                                <CardActionArea>

                                    <Button size="small" color="primary" onClick={event => onApproveClick(event,cat.id)}>
                                        Approve
                                    </Button>

                                    <Button size="small" color="primary" onClick={event => onDeleteClick(event,cat.id)}>
                                        Delete
                                    </Button>
                                </CardActionArea>
                            </Card>
                        </ul>
                    </li>

                )
            )
        }
        else return null;
    };

    useEffect(() => {
        getAllCategories().then(r => {
            setCategories(r);
        })

    }, []);


    return(
        <div className={classes.center}>
            <AppBar position={"relative"}>
                <Typography align="center" variant="h6" >
                    Caetegories
                </Typography>
            </AppBar>

            <List className={classes.root} subheader={<li />}>
                {categories ? mapCategories() : null}
            </List>



        </div>

    );

}