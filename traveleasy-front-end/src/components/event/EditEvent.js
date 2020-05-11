import React, {useEffect, useState} from "react";
import MyModal from "../../components/modal";
import {Button, Card, CardActionArea, CardActions, CardContent, Typography} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import DropZone from "../../components/dropzone/DropZone";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import {editEvent, getEvent, getScheduler, getService} from "../../utils/APIUtils";


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function EditEvent({open,handleClose,event,deleteEvent,editEvent}) {

    const [openLogin, setOpenLogin] = useState(true);
    const [openRegister, setOpenRegister] = useState(false);

    const [fixedDate, setFixedDate] = useState(false);
    const [fixedDateCheck, setFixedDateCheck] = useState(false);
    const [isDataSet, setIsDataSet] = useState(false);

    const [description, setDescription] = useState(false);
    const [pplCnt, setPplCnt] = useState("");
    const [sTime, setStime] = useState("07:30");
    const [sDate, setSDate] = useState("");
    const [eTime, setEtime] = useState("17:30");
    const [eDate, setEDate] = useState("");

    const [state,forceStateUpdate] = useState(false);

    const classes = useStyles();




    let onFixedDate = (e) => {
        e.preventDefault();

        if(event.fixed_date === false){
            event.fixed_date = true;
            event.end_time = '17:30'
        }else {
            event.fixed_date = false;
        }
        console.log(event.fixed_date);
        forceStateUpdate(!state);
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



    let onChange = (e) => {

        const inputId = e.target.id;
        const inputValue = e.target.value;
        switch(inputId) {

            case 'Description':
                setDescription(inputValue); // reminder
                break;

            case 'pplCnt':
                event.people_count = inputValue;
                forceStateUpdate(!state);
                break;

            case 'fixedDate':

                break;

            case 'sTime':
                event.start_time = inputValue;
                forceStateUpdate(!state);
                break;

            case 'sDate':
                event.start_date = inputValue;
                forceStateUpdate(!state);
                break;

            case 'eTime':
                event.end_time = inputValue;
                forceStateUpdate(!state);
                break;

            case 'eDate':
                event.end_date = inputValue;
                forceStateUpdate(!state);
                break;

            default:
                break;
        }
    };

    let handleCloseAndClearChecks = () =>{
        setIsDataSet(false);
        setFixedDateCheck(false);
        handleClose();
    };

    let checkEvent = () =>{
        return Object.values(event).length >= 1

    };
    if(!checkEvent()){
        return null;
    }

    return(
        <MyModal modalHeader={`Edit ${event.service.name} to events`} open={open} handleClose={handleCloseAndClearChecks}>
            <Card>
                <FormControl component="fieldset" >
                    <FormGroup aria-label="position" >



                        <Typography gutterBottom variant="h2" component="h2" >
                            {event.service.name}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {event.service.description}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                            Price: {event.service.price} &euro;
                        </Typography>


                        <FormGroup aria-label="position" row>
                            {categories()}
                        </FormGroup>

                        <br/>


                        <FormControlLabel
                            onClick={onFixedDate}
                            id="fixedDate"
                            value="Fixed Date"
                            control={<Checkbox checked={event.fixed_date} color="primary" />}
                            label="Fixed Date"
                            labelPlacement="end"
                        />



                        <TextField id="pplCnt"
                                   label="People count"
                                   value={event.people_count}
                                   onChange={(event) => onChange(event)}
                        />


                        {!event.fixed_date ? <div>
                            <FormGroup aria-label="position" row>

                                <TextField
                                    id="sDate"
                                    label="Start Date"
                                    value={event.start_date}
                                    onChange={(event) => onChange(event)}
                                    type="date"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                <TextField id="sTime"
                                           label="Start Time"
                                           value={event.start_time}
                                           onChange={(event) => onChange(event)}
                                           type="time"
                                           className={classes.textField}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           inputProps={{
                                               step: 300, // 5 min
                                           }}
                                />



                            </FormGroup>

                            <FormGroup aria-label="position" row>
                                <TextField
                                    id="eDate"
                                    label="End Date"
                                    value={event.end_date}
                                    onChange={(event) => onChange(event)}
                                    type="date"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                <TextField id="eTime"
                                           label="End Time"
                                           value={event.end_time}
                                           onChange={(event) => onChange(event)}
                                           type="time"
                                           className={classes.textField}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           inputProps={{
                                               step: 300, // 5 min
                                           }}
                                />


                            </FormGroup>
                        </div>:<div>
                            <FormGroup aria-label="position" row>
                                <TextField
                                    id="sDate"
                                    label="Date"
                                    value={event.start_date}
                                    onChange={(event) => onChange(event)}
                                    type="date"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                <TextField id="sTime"
                                           label="Time"
                                           value={event.start_time}
                                           onChange={(event) => onChange(event)}
                                           type="time"
                                           className={classes.textField}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           inputProps={{
                                               step: 300, // 5 min
                                           }}
                                />


                            </FormGroup>
                        </div>}

                        <br/>

                        <CardActions>
                            <Button color="primary"
                                    variant="contained"
                                    onClick={e => editEvent(e,event)}
                            >Submit</Button>

                            <Button color=""
                                    variant="contained"
                                    onClick={handleCloseAndClearChecks}

                            >Cancel</Button>

                        </CardActions>



                    </FormGroup>
                </FormControl>
            </Card>
        </MyModal>

    );
}