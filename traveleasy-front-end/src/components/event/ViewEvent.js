import React , {useState} from "react";
import MyModal from "../../components/modal";
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import DropZone from "../../components/dropzone/DropZone";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import {addServiceToEvents} from "../../utils/APIUtils";
import {isAdmin} from "../../utils/Utils";
import {useHistory} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function ViewEvent({open,handleClose,event,currentUser,onEditClick,onDeleteClick}) {

    const [openLogin, setOpenLogin] = useState(true);
    const [openRegister, setOpenRegister] = useState(false);

    const [fixedDate, setFixedDate] = useState(false);

    const [description, setDescription] = useState(false);
    const [pplCnt, setPplCnt] = useState("");
    const [sTime, setStime] = useState("07:30");
    const [sDate, setSDate] = useState("");
    const [eTime, setEtime] = useState("17:30");
    const [eDate, setEDate] = useState("");

    const classes = useStyles();
    const history = useHistory();


    const [thumb, setThumb] = useState(0);


    let onFixedDate = (event) => {
        event.preventDefault();
        if(fixedDate === false){
            setFixedDate(true)
        }else {
            setFixedDate(false)
        }
    };

    let showRegisterBox = (event) => {
        event.preventDefault();
        setOpenLogin(false);
        setOpenRegister(true);
    };

    let categories = () =>{

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

    let submit = (event) =>{
        event.preventDefault();
        const editRequest = {

            service:event.service,

            fixed_date:event.fixed_date,
            start_date:event.start_date,
            start_time:event.start_time,

            end_date:event.end_date,
            end_time:event.end_time,

            people_count: event.people_count
        };

        if(editRequest.people_count === ''){
            editRequest.people_count =0;
        }
        if(editRequest.start_date == null){
            editRequest.start_date = "";
        }
        if(editRequest.end_date == null){
            editRequest.start_date = "";
        }
        if(fixedDate){
            editRequest.end_date = "";
            editRequest.end_time = "";
        }

        addServiceToEvents(editRequest).then();
    };

    let onChange = (event) => {

        const inputId = event.target.id;
        const inputValue = event.target.value;

        switch(inputId) {

            case 'Description':
                setDescription(inputValue); // reminder
                break;

            case 'pplCnt':
                setPplCnt(inputValue);
                break;

            case 'sTime':
                setStime(inputValue);
                break;

            case 'sDate':
                setSDate(inputValue);
                break;

            case 'eTime':
                setEtime(inputValue);
                break;

            case 'eDate':
                setEDate(inputValue);
                break;

            default:
                break;
        }

    };


    let checkCurrentUser = () =>{

        if(currentUser.id === event.service.user.id){
            return true;
        }
        return false;
    };

    let onCheckProviderClick = (e) =>{
        e.preventDefault();
        history.push("profile/"+ event.service.user.id);
    };

    let nextPhoto = () =>{

        if(thumb < event.service.service_photo.length -1){
            setThumb(thumb +1);
        }else {
            setThumb(0);
        }

    };

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

    let checkEvent = () =>{
        return Object.values(event).length >= 1

    };
    if(!checkEvent()){
        return null;
    }
    let provider = event.service.user;


    return(
        <MyModal modalHeader={event.service.name} open={open} handleClose={handleClose}>
            <Card className="service">

                <CardActions>
                    {event.service.service_photo.length> 0 ? ServicesMedia(event.service.service_photo[thumb]) : null}
                </CardActions>

                <CardContent className={classes.info} >
                    <Typography gutterBottom variant="h2" component="h2" >
                        {event.service.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        {event.service.description}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">
                        Price: {event.service.price} &euro;
                    </Typography>
                    Categories:
                    <Grid container spacing={3}>
                        {categories()}
                    </Grid>
                    <Typography variant="body2" gutterBottom>
                        Start Date: {event.service.start_date}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        End Date: {event.service.end_date}
                    </Typography>

                    <Typography variant="body2" gutterBottom>
                        Start Time: {event.service.start_time}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        End Time: {event.service.end_time}
                    </Typography>

                    <Typography variant="body2" gutterBottom>
                        People :from {event.service.min_people_count} to {event.service.max_people_count}
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

                    {checkCurrentUser() ?
                        <Button size="small" color="primary" onClick={event => onEditClick(event)}>
                            Edit
                        </Button>: null}

                    {checkCurrentUser() ?
                        <Button  color="primary" onClick={e => onDeleteClick(e,event)}>
                            Delete
                        </Button>: null}

                    {!checkCurrentUser()  ?
                        <Button size="small" color="primary" onClick={event => onCheckProviderClick(event)}>
                            Check Provider
                        </Button> : null}
                </CardActions>

            </Card>

        </MyModal>


    );
}