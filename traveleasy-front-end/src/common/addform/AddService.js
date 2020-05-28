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
import {addServiceToEvents, getAllCategories, getPriceTypes} from "../../utils/APIUtils";
import swal from 'sweetalert';
import MenuItem from "@material-ui/core/MenuItem";


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function AddService({open,handleClose,service}) {

    const [openLogin, setOpenLogin] = useState(true);
    const [openRegister, setOpenRegister] = useState(false);

    const [fixedDate, setFixedDate] = useState(false);

    const [description, setDescription] = useState(false);
    const [pplCnt, setPplCnt] = useState(service.min_people_count);
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


    const [state, forceState] = useState(false);

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

    let submit = (event) =>{
        event.preventDefault();
        const addRequest = {

            service:service,

            fixed_date:fixedDate,
            start_date:sDate,
            start_time:sTime,

            end_date:eDate,
            end_time:eTime,

            people_count: pplCnt,
            price_counter: priceCounter
        };

        console.log(addRequest);
        if(addRequest.people_count === ""){
            addRequest.people_count =0;
        }
        if(addRequest.price_counter === ""){
            addRequest.price_counter = 0;
        }
        if(addRequest.start_date == null){
            addRequest.start_date = "";
        }
        if(addRequest.end_date === null){
            addRequest.start_date = "";
        }
        if(addRequest.start_time === ""){
            addRequest.start_time = "00:00";
        }
        if(addRequest.end_time === ""){
            addRequest.end_time = "24:00";
        }
        if(fixedDate){
            addRequest.end_date = "";
            addRequest.end_time = "";
        }


        console.log(addRequest);
        addServiceToEvents(addRequest).then( (r) => {
            // swal ( "Oops" ,  "Something went wrong!" ,  "error" )
            console.log(r);
        });
    };

    //servicetime > inputtime false
    let isLaterTime = (serviceTime,inputTime) =>{

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

    let onChange = (event) => {

        const inputId = event.target.id;
        const inputValue = event.target.value;

        let serviceStartDate = new Date(service.start_date);
        let serviceEndDate = new Date(service.end_date);
        let now = new Date();
            now.setHours(0,0,0,0);
        let inputDate;

        switch(inputId) {

            case 'Description':
                setDescription(inputValue); // reminder
                break;

            case 'pplCnt':
                if(service.max_people_count !== 0 && inputValue > service.max_people_count){
                    setPplCntCorrect({
                        status:true,
                        message:`Maximum people count is ${service.max_people_count}`
                    });
                }else if(service.min_people_count !== 0 && inputValue < service.min_people_count){
                    setPplCntCorrect({
                        status:true,
                        message:`Minimum people count is ${service.min_people_count}`
                    });
                }else {
                    setPplCntCorrect({
                        status:false,
                        message:""
                    });

                }

                setPplCnt(inputValue);
                break;

            case 'sTime':
                if(service.end_time !== "00:00:00" && service.start_time !== "00:00:00") {
                    if (!isLaterTime(inputValue, service.start_time)) {
                        setSTimeCorrect({
                            status: true,
                            message: `Service Starts at ${service.start_time}`
                        });
                    } else if (!isLaterTime(service.end_time, inputValue)) {
                        setSTimeCorrect({
                            status: true,
                            message: `Service Ends at ${service.end_time}`
                        });
                    } else {
                        setSTimeCorrect({
                            status: false,
                            message: ""
                        });

                    }
                }
                setStime(inputValue);
                break;

            case 'sDate':

                inputDate = new Date(inputValue);

                if(inputValue !== ""
                    && serviceStartDate.getTime() !== 0
                    && inputDate.getTime() < serviceStartDate.getTime()){

                    setSDateCorrect({
                        status: true,
                        message: `Service Starts at ${service.start_date}`
                    });

                }else if(inputValue !== ""
                && serviceStartDate.getTime() !== 0
                && inputDate.getTime() < now.getTime()){

                    console.log(inputDate.getTime());
                    console.log(now.getTime());

                setSDateCorrect({
                    status: true,
                    message: `Event can't start before current date`
                })
                }
                else if(inputValue !== ""
                    && serviceEndDate.getTime() !== 0
                    && inputDate.getTime() > serviceEndDate.getTime()){

                    setSDateCorrect({
                        status: true,
                        message: `Service Ends at ${service.end_date}`
                    });

                }
                else if(inputValue !== ""
                        && new Date(eDate).getTime() !== 0
                        && inputDate.getTime() > new Date(eDate).getTime() ){
                    setSDateCorrect({
                        status: true,
                        message: `Event Start date can't be bigger than End date`
                    });

                    setEDateCorrect({
                        status: true,
                        message: `Event End date can't be smaller than Start date`
                    });

                }else if(
                    !fixedDate
                    && inputValue !== ""
                    && new Date(eDate).getTime() !== 0
                    && inputDate.getTime() === new Date(eDate).getTime() ){

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

                setSDate(inputValue);
                break;

            case 'eTime':
                console.log(service.end_time)
                console.log(service.start_time)
                if(service.end_time !== "00:00:00" && service.start_time !== "00:00:00"){
                    if(!isLaterTime(service.end_time,inputValue)){
                        setETimeCorrect({
                            status:true,
                            message:`Service Ends at ${service.end_time}`
                        });
                    }else if(!isLaterTime(inputValue,service.start_time)){
                        setETimeCorrect({
                            status:true,
                            message:`Service starts at ${service.start_time}`
                        });
                    }else {
                        setETimeCorrect({
                            status:false,
                            message:""
                        });

                    }
                }
                setEtime(inputValue);
                break;

            case 'eDate':

                inputDate = new Date(inputValue);


                if(inputValue !== ""
                    && serviceStartDate.getTime() !== 0
                    && inputDate.getTime() < serviceStartDate.getTime()){

                    setEDateCorrect({
                        status: true,
                        message: `Service Starts at ${service.start_date}`
                    });

                }
                else if(inputValue !== ""
                    && serviceStartDate.getTime() !== 0
                    && inputDate.getTime() < now.getTime()){

                    setEDateCorrect({
                        status: true,
                        message: `Event can't end before current date`
                    })
                }else if(inputValue !== ""
                    && eDate !== ""
                    && serviceEndDate.getTime() !== 0
                    && inputDate.getTime() > serviceEndDate.getTime()){

                    setEDateCorrect({
                        status: true,
                        message: `Service Ends at ${service.end_date}`
                    });

                }
                else if(
                    !fixedDate
                    && inputValue !== ""
                    && new Date(sDate).getTime() !== 0
                    && inputDate.getTime() < new Date(sDate).getTime() ){
                    setEDateCorrect({
                        status: true,
                        message: `Event End date can't be smaller than Start date`
                    });

                    setSDateCorrect({
                        status: true,
                        message: `Event Start date can't be bigger than End date`
                    });

                } else if(
                    !fixedDate
                    && inputValue !== ""
                    && new Date(sDate).getTime() !== 0
                    && inputDate.getTime() === new Date(sDate).getTime() ){

                    setEDateCorrect({
                        status: true,
                        message: `Non fixed event's dates can't match`
                    });

                    setSDateCorrect({
                        status: true,
                        message: `Non fixed event's dates can't match`
                    });
                }
                else {
                    setEDateCorrect({
                        status: false,
                        message: ""
                    });
                    setSDateCorrect({
                        status: false,
                        message: ""
                    });
                }

                setEDate(inputValue);
                break;

            case 'priceCounter':
                setPriceCounter(inputValue);
                break;

            default:
                break;
        }

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
       }else if(sDate === ""){
           setSDateCorrect({
               status: true,
               message: `Service Start Date Cant be empty`
           });
           return true
       }else if(priceCounter === ""){
           return true;
       }
       else {

           return false;
       }



    };
    useEffect(() => {
        if (service.price_type !== "UNIT" && service.price_type !== "KM"){
            setPriceCounter(0);
        }

    }, [service.price_type]);
    return(
        <MyModal modalHeader={`Adding ${service.name} to events`} open={open} handleClose={handleClose}>
        <Card>
            <FormControl component="fieldset" onSubmit={submit}>
                <FormGroup aria-label="position" >



                    <Typography gutterBottom variant="h2" component="h2" >
                        {service.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        {service.description}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">
                        Price: {service.price} &euro; per {service.price_type}
                    </Typography>


                    <FormGroup aria-label="position" row>
                        {categories()}
                    </FormGroup>

                    {service.price_type === "KM" ?
                        <TextField id="priceCounter"
                        type={"number"}
                        label="Kilometer Count"
                        value={priceCounter}
                        error={priceCounter === ""}
                        onChange={(event) => onChange(event)}
                        />
                        : null}

                    {service.price_type === "UNIT" ?
                        <TextField id="priceCounter"
                                   type={"number"}
                                   label="Unit Count"
                                   value={priceCounter}
                                   error={priceCounter === ""}
                                   onChange={(event) => onChange(event)}
                        />
                        : null}


                    <br/>


                    <FormControlLabel
                        onClick={onFixedDate}
                        id="1"
                        value="Fixed Date"
                        control={<Checkbox checked={fixedDate} color="primary" />}
                        label="Fixed Date"
                        labelPlacement="end"
                    />

                    {/*{!pplCntCorrect*/}
                    {/*    ? error*/}
                    {/*    helperText="Incorrect entry." :null}*/}

                        <TextField id="pplCnt"
                                   error={pplCntCorrect.status}
                                   helperText={pplCntCorrect.message}
                                   type={"number"}
                                   label="People count"
                                   value={pplCnt}
                                   onChange={(event) => onChange(event)}
                        />


                    {!fixedDate ? <div>
                        <FormGroup aria-label="position" row>

                            <TextField
                                id="sDate"
                                error={sDateCorrect.status}
                                helperText={sDateCorrect.message}
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
                                       error={sTimeCorrect.status}
                                       helperText={sTimeCorrect.message}
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
                                error={eDateCorrect.status}
                                helperText={eDateCorrect.message}
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
                                       error={eTimeCorrect.status}
                                       helperText={eTimeCorrect.message}
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
                                error={sDateCorrect.status}
                                helperText={sDateCorrect.message}
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
                                       error={sTimeCorrect.status}
                                       helperText={sTimeCorrect.message}
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
                        <Button disabled={checkErrors()}
                                color="primary"
                                variant="contained"
                                onClick={submit}
                        >Submit</Button>

                        <Button color=""
                                variant="contained"
                                onClick={handleClose}

                        >Cancel</Button>

                    </CardActions>



                </FormGroup>
            </FormControl>
        </Card>
        </MyModal>

    );
}