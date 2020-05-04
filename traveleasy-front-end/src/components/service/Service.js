import React, {useEffect, useState} from "react";
import {Card, CardActions,CardActionArea, CardMedia,CardContent,Typography,Button} from "@material-ui/core";
import {isAdmin} from  '../../utils/Utils'


import {makeStyles,useTheme} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import ServiceData from "../../pages/service/ServiceData";


const useStyles = makeStyles({
    root: {
        padding: "10px",
        border: "1px solid "

    },
    image:{
        width: "50%",
        margin: "auto",
        align:"center"
    }
});

export default function Service({service}) {

    const [photos, setPhotos] = useState([]);
    const [thumb, setThumb] = useState(0);
    const [openService, setOpenService] = useState(false);


    const currentUser = useSelector(state => state.currentUserReducer);
    const history = useHistory();

    let nextPhoto = () =>{

        if(thumb < service.service_photo.length -1){
            setThumb(thumb +1);
        }else {
            setThumb(0);
        }

    };

    let checkUser = () =>{
        if(currentUser.id === service.user.id){
            return true;
        }
        return false;
    };


    const classes = useStyles();
    const theme = useTheme();

    let ServicesMedia = (photo) =>{

        return  (
                <CardMedia className={classes.image}
                           component="img"
                           alt={photo.name}
                           image={"http://localhost:3001/api/photo/" + photo.id}
                           title={photo.name}
                           onClick={nextPhoto}
                />
            )
    };

    let onEditClick = (event) =>{
        event.preventDefault();
        console.log("onEditClick");
        history.push("service/edit/" + service.id);
    };

    let onDeleteClick = (event) =>{
        event.preventDefault();
        console.log("onDeleteClick")
    };
    let onCheckProviderClick = (event) =>{
        event.preventDefault();
        console.log("onCheckProviderClick")
    };
    let onOpenClick = (event) =>{
        event.preventDefault();
        setOpenService(true);
    };

    let onAddClick = (event) =>{
        event.preventDefault();
        setOpenService(true);
    };

    let onCloseService = (event) =>{
        event.preventDefault();
        setOpenService(false);
    };

    useEffect(() => {
        setPhotos(service.service_photo)
    }, []);

    return(
        <div>
        <Card key={service.id} className={classes.root}>
            <CardActionArea>
                <CardActions>
                    {photos.length > 0 ? ServicesMedia(photos[thumb]) : null}
                </CardActions>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {service.name} Price: {service.price} &euro;
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {service.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>

                {checkUser() || isAdmin(currentUser) ?
                    <Button size="small" color="primary" onClick={event => onEditClick(event)}>
                        Edit
                    </Button>: null}

                {checkUser() || isAdmin(currentUser) ?
                    <Button size="small" color="primary" onClick={event => onDeleteClick(event)}>
                    Delete
                    </Button>: null}

                <Button size="small" color="primary" onClick={event => onOpenClick(event)}>
                    Open
                </Button>

                {!checkUser() ?
                <Button size="small" color="primary" onClick={event => onCheckProviderClick(event)}>
                    Check Provider
                </Button> : null}

                <Button size="small" color="primary" onClick={event => onAddClick(event)}>
                    Add
                </Button>


            </CardActions>
        </Card>
        <ServiceData  open={openService}
                      handleClose={onCloseService}
                      service={service}

                      checkUser={checkUser}
                      onAddClick={onAddClick}
                      onDeleteClick={onDeleteClick}
                      onEditClick={onEditClick}
                      onCheckProviderClick={onCheckProviderClick}
        />

        </div>

    );

}