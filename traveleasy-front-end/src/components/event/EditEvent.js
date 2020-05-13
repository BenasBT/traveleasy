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

    const [pplCntCorrect, setPplCntCorrect] = useState({status:false,message:""});

    const [sTimeCorrect, setSTimeCorrect] = useState({status:false,message:""});
    const [eTimeCorrect, setETimeCorrect] = useState({status:false,message:""});

    const [sDateCorrect, setSDateCorrect] = useState({status:false,message:""});
    const [eDateCorrect, setEDateCorrect] = useState({status:false,message:""});

    const [priceCounter, setPriceCounter] = useState("");


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


    //servicetime > inputtime false
    let isLaterTime = (serviceTime,inputTime) =>{
        // if(serviceTime === "00:00"){
        //     serviceTime = "24:00"
        // }
        // if(inputTime === "00:00"){
        //     inputTime = "24:00"
        // }

        let serviceTimeParts = serviceTime.split(":");
        let inputTimeParts = inputTime.split(":");
        if (serviceTimeParts[0] < inputTimeParts[0]) {
            // console.log("Hours");
            // console.log(serviceTimeParts[0])
            // console.log(inputTimeParts[0])
            return false;
        }else if(serviceTimeParts[0] === inputTimeParts[0]){
            if(serviceTimeParts[1] < inputTimeParts[1]){
                // console.log("Minutes");
                // console.log(serviceTimeParts[1])
                // console.log(inputTimeParts[1])
                return false
            }
        }
        console.log("true");
        return true

    };

    let onChange = (e) => {

        const inputId = e.target.id;
        const inputValue = e.target.value;

        let serviceStartDate = new Date(event.service.start_date);
        let serviceEndDate = new Date(event.service.end_date);
        let inputDate;

        switch(inputId) {

            case 'Description':
                setDescription(inputValue); // reminder
                break;

            case 'pplCnt':

                if(event.service.max_people_count !== 0 && inputValue > event.service.max_people_count){
                    setPplCntCorrect({
                        status:true,
                        message:`Maximum people count is ${event.service.max_people_count}`
                    });
                }else if(event.service.min_people_count !== 0 && inputValue < event.service.min_people_count){
                    setPplCntCorrect({
                        status:true,
                        message:`Minimum people count is ${event.service.min_people_count}`
                    });
                }else {
                    setPplCntCorrect({
                        status:false,
                        message:""
                    });

                }

                event.people_count = inputValue;
                forceStateUpdate(!state);
                break;

            case 'fixedDate':

                break;

            case 'sTime':

                if(event.service.end_time !== null && event.service.start_time !== null) {
                    if (!isLaterTime(inputValue, event.service.start_time)) {
                        setSTimeCorrect({
                            status: true,
                            message: `Service Starts at ${event.service.start_time}`
                        });
                    } else if (!isLaterTime(event.service.end_time, inputValue)) {
                        setSTimeCorrect({
                            status: true,
                            message: `Service Ends at ${event.service.end_time}`
                        });
                    } else {
                        setSTimeCorrect({
                            status: false,
                            message: ""
                        });

                    }
                }

                event.start_time = inputValue;
                forceStateUpdate(!state);
                break;

            case 'sDate':

                inputDate = new Date(inputValue);

                if(inputValue !== ""
                    && serviceStartDate.getTime() !== 0
                    && inputDate.getTime() < serviceStartDate.getTime()){

                    setSDateCorrect({
                        status: true,
                        message: `Service Starts at ${event.service.start_date}`
                    });

                }else if(inputValue !== ""
                    && serviceEndDate.getTime() !== 0
                    && inputDate.getTime() > serviceEndDate.getTime()){

                    setSDateCorrect({
                        status: true,
                        message: `Service Ends at ${event.service.end_date}`
                    });

                } else if(!event.fixed_date
                    && inputValue !== ""
                    && new Date(event.end_date).getTime() !== 0
                    && inputDate.getTime() > new Date(event.end_date).getTime() ){
                    setSDateCorrect({
                        status: true,
                        message: `Event Start date can't be bigger than End date`
                    });

                    setEDateCorrect({
                        status: true,
                        message: `Event End date can't be smaller than Start date`
                    });

                }else if(!event.fixed_date
                    && inputValue !== ""
                    && new Date(event.end_date).getTime() !== 0
                    && inputDate.getTime() === new Date(event.end_date).getTime() ){

                    setSDateCorrect({
                        status: true,
                        message: `Non fixed event's dates can't match`
                    });

                    setEDateCorrect({
                        status: true,
                        message: `Non fixed event's dates can't match`
                    });
                }
                else {
                    setSDateCorrect({
                        status: false,
                        message: ""
                    });
                    setEDateCorrect({
                        status: false,
                        message: ""
                    });
                }
                event.start_date = inputValue;
                forceStateUpdate(!state);
                break;

            case 'eTime':
                console.log(inputValue);
                if(event.service.end_time !== null && event.service.start_time !== null){
                    if(!isLaterTime(event.service.end_time,inputValue)){

                        setETimeCorrect({
                            status:true,
                            message:`Service Ends at ${event.service.end_time}`
                        });
                    }
                    else if(!isLaterTime(inputValue,event.service.start_time)){

                        setETimeCorrect({
                            status:true,
                            message:`Service starts at ${event.service.start_time}`
                        });
                    }
                    else {
                        setETimeCorrect({
                            status:false,
                            message:""
                        });

                    }
                }
                event.end_time = inputValue;
                forceStateUpdate(!state);
                break;

            case 'eDate':

                inputDate = new Date(inputValue);


                if(inputValue !== ""
                    && serviceStartDate.getTime() !== 0
                    && inputDate.getTime() < serviceStartDate.getTime()){

                    setEDateCorrect({
                        status: true,
                        message: `Service Starts at ${event.service.start_date}`
                    });

                }else if(inputValue !== ""
                    && serviceEndDate.getTime() !== 0
                    && inputDate.getTime() > serviceEndDate.getTime()){

                    setEDateCorrect({
                        status: true,
                        message: `Service Ends at ${event.service.end_date}`
                    });

                }
                else if(
                    !event.fixed_date
                    && inputValue !== ""
                    && new Date(event.start_date).getTime() !== 0
                    && inputDate.getTime() < new Date(event.start_date).getTime() ){
                    setEDateCorrect({
                        status: true,
                        message: `Event End date can't be smaller than Start date`
                    });

                    setSDateCorrect({
                        status: true,
                        message: `Event Start date can't be bigger than End date`
                    });

                }else if(!event.fixed_date
                    && inputValue !== ""
                    && new Date(event.start_date).getTime() !== 0
                    && inputDate.getTime() === new Date(event.start_date).getTime() ){

                    console.log("hit");

                    setEDateCorrect({
                        status: true,
                        message: `Non fixed event's dates can't match`
                    });

                    setSDateCorrect({
                        status: true,
                        message: `Non fixed event's dates can't match`
                    });
                }else {
                    setEDateCorrect({
                        status: false,
                        message: ""
                    });
                    setSDateCorrect({
                        status: false,
                        message: ""
                    });
                }

                event.end_date = inputValue;
                forceStateUpdate(!state);
                break;

            case 'priceCounter':
                event.price_counter = inputValue;
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

    let checkErrors = () =>{

        if(pplCntCorrect.status){
            return true;
        }
        else if(sTimeCorrect.status){
            return true;
        }
        else if(eTimeCorrect.status){
            return true;
        }
        else if(sDateCorrect.status){
            return true;
        }
        else if(eDateCorrect.status){
            return true;
        }else {
            return false
        }
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

                        {event.service.price_type === "KM" ?
                            <TextField id="priceCounter"
                                       type={"number"}
                                       label="Kilometer Count"
                                       value={event.priceCounter}
                                       onChange={(event) => onChange(event)}
                            />
                            : null}

                        {event.service.price_type === "UNIT" ?
                            <TextField id="priceCounter"
                                       type={"number"}
                                       label="Unit Count"
                                       value={event.priceCounter}
                                       onChange={(event) => onChange(event)}
                            />
                            : null}

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
                                   error={pplCntCorrect.status}
                                   helperText={pplCntCorrect.message}
                                   label="People count"
                                   value={event.people_count}
                                   onChange={(event) => onChange(event)}
                        />


                        {!event.fixed_date ? <div>
                            <FormGroup aria-label="position" row>

                                <TextField
                                    id="sDate"
                                    error={sDateCorrect.status}
                                    helperText={sDateCorrect.message}
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
                                           error={sTimeCorrect.status}
                                           helperText={sTimeCorrect.message}
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
                                    error={eDateCorrect.status}
                                    helperText={eDateCorrect.message}
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
                                           error={eTimeCorrect.status}
                                           helperText={eTimeCorrect.message}
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
                                    error={sDateCorrect.status}
                                    helperText={sDateCorrect.message}
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
                                           error={setSTimeCorrect.status}
                                           helperText={sTimeCorrect.message}
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
                            <Button disabled={checkErrors()}
                                    color="primary"
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