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

    const classes = useStyles();




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
    }if(!fixedDate && event.fixed_date && !fixedDateCheck){
        setFixedDate(true);
        setFixedDateCheck(true);
    }if(!isDataSet){
        console.log("We are setting values");
        setIsDataSet(true);
        setPplCnt(event.people_count);
        setStime(event.start_time);
        setSDate(event.start_date);
        setEtime(event.end_time);
        setEDate(event.end_date);
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
                            id="1"
                            value="Fixed Date"
                            control={<Checkbox checked={fixedDate} color="primary" />}
                            label="Fixed Date"
                            labelPlacement="end"
                        />



                        <TextField id="pplCnt"
                                   label="People count"
                                   value={pplCnt}
                                   onChange={(event) => onChange(event)}
                        />


                        {!fixedDate ? <div>
                            <FormGroup aria-label="position" row>

                                <TextField
                                    id="sDate"
                                    label="Start Date"
                                    value={sDate}
                                    onChange={(event) => onChange(event)}
                                    type="date"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                <TextField id="sTime"
                                           label="Start Time"
                                           value={sTime}
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
                                    value={eDate}
                                    onChange={(event) => onChange(event)}
                                    type="date"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                <TextField id="eTime"
                                           label="End Time"
                                           value={eTime}
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
                                    value={sDate}
                                    onChange={(event) => onChange(event)}
                                    type="date"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                <TextField id="sTime"
                                           label="Time"
                                           value={sTime}
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
                                    onClick={e => editEvent(e,event,fixedDate,sDate,sTime,eDate,eTime,pplCnt)}
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