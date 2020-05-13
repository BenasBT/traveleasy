import React, {useEffect, useState} from "react";
import {Card, CardActions,CardActionArea, CardMedia,CardContent,Typography,Button} from "@material-ui/core";
import {isAdmin} from  '../../utils/Utils'


import {makeStyles,useTheme} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {useHistory, useLocation, useParams} from "react-router-dom";
import ServiceData from "../../pages/service/ServiceData";
import {deleteService,
        markService,
        unmarkService,
        approveService,
        denyService} from '../../utils/APIUtils';
import MyModal from "../modal/MyModal";
import FormGroup from "@material-ui/core/FormGroup";
import AddService from "../../common/addform";

const useStyles = makeStyles({
    root: {
        padding: "10px",
        border: "1px solid "

    },
    image:{
        margin: "auto",
        align:"center",
        "max-height": "180px",
        "max-width": "300px",
        // height: 180,
        // width: 300,

    }
});

export default function Service({service,servicesState,ps,fs,CheckUserClicked,marked,admin}) {

    const [photos, setPhotos] = useState([]);
    const [thumb, setThumb] = useState(0);
    const [openService, setOpenService] = useState(false);
    const [addService, setAddService] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);


    const currentUser = useSelector(state => state.currentUserReducer);
    const history = useHistory();

    let nextPhoto = () =>{

        if(thumb < service.service_photo.length -1){
            setThumb(thumb +1);
        }else {
            setThumb(0);
        }

    };



    let checkCurrentUser = () =>{

        if(currentUser.id === service.user.id){
            return true;
        }
        return false;
    };

    let checkUserClicked = () =>{

        if(typeof CheckUserClicked !== 'undefined'){
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
    // let {id} = useParams();
    // let location= useLocation();
    let onEditClick = (event) =>{
        event.preventDefault();

        history.push("/service/edit/" + service.id);
    };




    let onCheckProviderClick = (event) =>{
        event.preventDefault();
        history.push("profile/"+ service.user.id);
    };
    let onOpenClick = (event) =>{
        event.preventDefault();
        setOpenService(true);
    };

    let onAddClick = (event) =>{
        event.preventDefault();
        setAddService(true);
    };


    let onMarkClick = (event,id) =>{
        event.preventDefault();
        markService(id).then(r => console.log(r));

    };

    let onUnmarkClick = (event) =>{
        event.preventDefault();
        unmarkService(service.id).then(r => console.log(r));
        let index = -1;
        servicesState.forEach((stateService,i) => {
            if(stateService.id === service.id){
                index=i;
            }
        });

        if (index > -1) {
            servicesState.splice(index, 1);
        }
        fs(!ps);

    };

    let onCloseService = (event) =>{
        event.preventDefault();
        setOpenService(false);
    };

    useEffect(() => {
        setPhotos(service.service_photo)
    }, []);


    let onDeleteService = (event) =>{
        event.preventDefault();
        deleteService(service.id).then(r => console.log(r));
        setOpenDelete(false);

        let index = -1;
        servicesState.forEach((stateService,i) => {
            if(stateService.id === service.id){
                index=i;
            }
        });

        if (index > -1) {
            servicesState.splice(index, 1);
        }
        fs(!ps);

    };

    let onDeleteClick = (event) => {
        event.preventDefault();
        setOpenDelete(true);
    };

    let handleClose = (event) => {
        event.preventDefault();
        setOpenDelete(false);
    };

    let closeAddService = (event) => {
        event.preventDefault();
        setAddService(false);
    };

    let onAproveService = (event) => {
        event.preventDefault();
        approveService(service.id);
        service.status = 'ACTIVE';
        fs(!ps);

    };

    let onDenyService = (event) => {
        event.preventDefault();
        denyService(service.id);


        service.status = 'DENIED';
        fs(!ps);
    };

    let ConfirmDelete = () =>{
        return(
            <MyModal modalHeader={"Are you sure ?"} open={openDelete} handleClose={handleClose}>
                <Card>

                    <Typography variant="body2" gutterBottom>
                        Are you sure you want to remove this service ?
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        {service.name}
                    </Typography>

                    <CardActions>
                        <Button
                            variant="contained"
                            onClick={handleClose}
                        >Cancel</Button>

                        <Button color="primary"
                                variant="contained"
                                onClick={event => onDeleteService(event)}

                        >Delete</Button>
                    </CardActions>
                </Card>
            </MyModal>
        );
    };

    return(
        <div>
        <Card key={service.id} className={classes.root}>
            <CardActionArea>
                {admin ?
                    <FormGroup aria-label="position" row>
                        <Typography gutterBottom variant="h5" component="h2">
                            {service.status}
                        </Typography>
                        <CardActions>
                        <Button size="small" color="primary" onClick={event => onAproveService(event)}>
                            Approve
                        </Button>
                        <Button size="small" color="primary" onClick={event => onDenyService(event)}>
                            Deny
                        </Button>
                        </CardActions>
                    </FormGroup>


                    : null}

                <CardActions>
                    {photos.length > 0 ? ServicesMedia(photos[thumb]) : null}
                </CardActions>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {service.name} Price: {service.price} &euro; per {service.price_type}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {service.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>

                <FormGroup aria-label="position" row>

                {checkCurrentUser() || isAdmin(currentUser) ?
                    <Button size="small" color="primary" onClick={event => onEditClick(event)}>
                        Edit
                    </Button>: null}

                {checkCurrentUser() || isAdmin(currentUser) ?
                    <Button size="small" color="primary" onClick={event => onDeleteClick(event)}>
                    Delete
                    </Button>: null}

                <Button size="small" color="primary" onClick={event => onOpenClick(event)}>
                    Open
                </Button>

                {!checkUserClicked() && !checkCurrentUser() ?
                <Button size="small" color="primary" onClick={event => onCheckProviderClick(event)}>
                    Check Provider
                </Button> : null}

                <Button size="small" color="primary" onClick={event => onAddClick(event)}>
                    Add
                </Button>
                <Button size="small" color="primary" onClick={event => onMarkClick(event,service.id)}>
                    Mark
                </Button>
                    {marked ?
                    <Button size="small" color="primary" onClick={event => onUnmarkClick(event)}>
                        Unmark
                    </Button>: null}

                </FormGroup>

            </CardActions>
        </Card>
        <ServiceData  open={openService}
                      handleClose={onCloseService}
                      service={service}
                      checkCurrentUser={checkCurrentUser}
                      onAddClick={onAddClick}
                      onDeleteClick={onDeleteClick}
                      onEditClick={onEditClick}
                      onCheckProviderClick={onCheckProviderClick}
                      CheckUserClicked={CheckUserClicked}
                      onMarkClick ={onMarkClick}
        />

            {ConfirmDelete()}
            <AddService handleClose={closeAddService} open={addService} service={service}/>

        </div>



    );

}