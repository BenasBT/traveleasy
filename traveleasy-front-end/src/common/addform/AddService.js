import React , {useState} from "react";
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
import {addServiceToEvents} from "../../utils/APIUtils";


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

            people_count: pplCnt
        };

        if(addRequest.people_count === ''){
            addRequest.people_count =0;
        }
        if(addRequest.start_date == null){
            addRequest.start_date = "";
        }
        if(addRequest.end_date == null){
            addRequest.start_date = "";
        }
        if(fixedDate){
            addRequest.end_date = "";
            addRequest.end_time = "";
        }


        console.log(addRequest);
        addServiceToEvents(addRequest).then();
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
                                   type={"number"}
                                   label="People count"
                                   value={service.pplCnt}
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