import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import {useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardMedia, CardContent, Typography, CardActions, CardActionArea, Button} from "@material-ui/core";
import MyModal from "../../components/modal/MyModal";
import LoginForm from "../../user/login/LoginForm";
import RegisterForm from "../../user/register/RegisterForm";
import Grid from '@material-ui/core/Grid';
import {isAdmin} from "../../utils/Utils";

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 345,
    },
    image :{
        display:'block',
        marginLeft:'auto',
        marginRight:'auto',
        width: '25%',
        borderRadius: 50,
        height: 'auto',



    },
    info :{
        margin:'auto',
        textAlign: 'center',
        width: '50%'
    },


}));


export default function ServiceData({open,
                                    handleClose,
                                    service,

                                    onAddClick,
                                    checkUser,
                                    onEditClick,
                                    onDeleteClick,
                                    onCheckProviderClick}) {
    //Picture if exist else some defoult picture
    //Display data

    const [thumb, setThumb] = useState(0);


    let nextPhoto = () =>{

        if(thumb < service.service_photo.length -1){
            setThumb(thumb +1);
        }else {
            setThumb(0);
        }

    };

    let {id} = useParams();
    //let serveice = getServiceInfo(id);
    //let provider = getProviderInfo(serveice.providerId);

    let provider = service.user;

    const currentUser = useSelector(state => state.currentUserReducer);
    const classes = useStyles();


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

    let categories = () =>{

        return  (
            service.service_category.filter((category => category.valid))
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


    return(
            <MyModal modalHeader={service.name} open={open} handleClose={handleClose}>
                    <Card className="service">

                        <CardActions>
                            {service.service_photo.length> 0 ? ServicesMedia(service.service_photo[thumb]) : null}
                        </CardActions>

                        <CardContent className={classes.info} >
                            <Typography gutterBottom variant="h2" component="h2" >
                                {service.name}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {service.description}
                            </Typography>
                            <Typography gutterBottom variant="h5" component="h2">
                                Price: {service.price} &euro;
                            </Typography>
                            Categories:
                            <Grid container spacing={3}>
                            {categories()}
                            </Grid>
                            <Typography variant="body2" gutterBottom>
                                Start Date: {service.start_date}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                End Date: {service.end_date}
                            </Typography>

                            <Typography variant="body2" gutterBottom>
                                Start Time: {service.start_time}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                End Time: {service.end_time}
                            </Typography>

                            <Typography variant="body2" gutterBottom>
                                People :from {service.min_people_count} to {service.max_people_count}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {provider.email ? <Typography variant="body2" gutterBottom>
                                                    Email: {provider.email}
                                                  </Typography> : null}
                                {provider.phone ?<Typography variant="body2" gutterBottom>
                                                    Phone: {provider.phone}
                                                    </Typography> : null}
                            </Typography>
                            {}
                            <Typography variant="body2" color="textSecondary" component="p">
                            </Typography>
                        </CardContent>

                        <CardActions>

                            <Button size="small" color="primary" onClick={event => onAddClick(event)}>
                                Add
                            </Button>

                            {checkUser() || isAdmin(currentUser) ?
                                <Button size="small" color="primary" onClick={event => onEditClick(event)}>
                                    Edit
                                </Button>: null}

                            {checkUser() || isAdmin(currentUser) ?
                                <Button  color="primary" onClick={event => onDeleteClick(event)}>
                                    Delete
                                </Button>: null}

                            {!checkUser() ?
                                <Button size="small" color="primary" onClick={event => onCheckProviderClick(event)}>
                                    Check Provider
                                </Button> : null}
                        </CardActions>

                    </Card>

            </MyModal>


    );

}