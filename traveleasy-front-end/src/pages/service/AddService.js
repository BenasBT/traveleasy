import React, {useEffect, useState} from "react";
import DropZone from "../../components/dropzone/DropZone";
import {useDispatch, useSelector} from "react-redux";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import {
    getAllCategories,
    addServiceFiles,
    getPriceTypes, getCurrentUser
} from '../../utils/APIUtils'
import {useHistory} from "react-router-dom";

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {Typography} from "@material-ui/core";
import InputAdornment from '@material-ui/core/InputAdornment';
import swal from "sweetalert";
export default function AddService() {

    const currentUser = useSelector(state => state.currentUserReducer);

    const [name, setName] = useState("");
    const [description,setDescription ] = useState("");
    const [categories,setCategories ] = useState([]);

    const [newCategory,setNewCategory ] = useState("");
    const [price,setPrice ] = useState("");

    const [minPplCnt,setMinPplCnt] = useState("");
    const [maxPplCnt,setMaxPplCnt] = useState("");

    const [sTime,setStime] = useState("07:30");
    const [eTime,setEtime] = useState("17:30");

    const [sDate,setSDate] = useState("");
    const [eDate,setEDate] = useState("");

    const [displayOther,setDisplayOther] = useState(false);

    const [files, setFiles] = useState([]);

    const [openPriceType, setOpenPriceType] = useState(false);
    const [priceType, setPriceType] = useState(null);
    const [priceTypes, setPriceTypes] = useState(null);

    const [sTimeCorrect, setSTimeCorrect] = useState({status:false,message:""});
    const [eTimeCorrect, setETimeCorrect] = useState({status:false,message:""});

    const [sDateCorrect, setSDateCorrect] = useState({status:false,message:""});
    const [eDateCorrect, setEDateCorrect] = useState({status:false,message:""});

    const [minPplCntCorrect, setMinPplCntCorrect] = useState({status:false,message:""});
    const [maxPplCntCorrect, setMaxPplCntCorrect] = useState({status:false,message:""});

    const history = useHistory();
    const dispatch = useDispatch();

    const useStyles = makeStyles((theme) => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },

        },
        select:{
            width:"130px"
        }
    }));



    //console.log(new File(myBlob, "filename"));
    let submit = (event) => {
        event.preventDefault();

        let checkedCategories = categories.filter( category => category.checked)
            .map((category => ({id: category.id, name: category.name})));

        const addRequest = {
            name: name,
            description: description,

            categories:checkedCategories,
            newCategoryChecked:displayOther,
            newCategory:newCategory,

            price: price,
            price_type: priceType,

            start_date:sDate,
            start_time:sTime,
            end_time:eTime,
            end_date:eDate,

            min_people_count: minPplCnt,
            max_people_count: maxPplCnt,
        };

        if(addRequest.max_people_count === ''){
            addRequest.max_people_count =0;
        }
        if(addRequest.min_people_count === ''){
            addRequest.min_people_count =0;
        }
        if(addRequest.price === ''){
            addRequest.price =0;
        }
        if(addRequest.start_date == null){
            addRequest.start_date = "";
        }
        if(addRequest.end_date == null){
            addRequest.start_date = "";
        }
        if(addRequest.start_time === ""){
            addRequest.start_time = "00:00";
        }
        if(addRequest.end_time === ""){
            addRequest.end_time = "24:00";
        }

        const formData = new FormData();

        for(let i = 0; i< files.length; i++) {
            formData.append('file', files[i]);
        }

        console.log(addRequest);
        formData.set('data',JSON.stringify(addRequest));

        addServiceFiles(formData).then(
            ()=> getCurrentUser(dispatch).then()
        );



    };

    let onChange = (event) => {

    const inputId = event.target.id;
    const inputValue = event.target.value;

        switch(inputId) {
            case 'Name':
                setName( inputValue);
                break;

            case 'Description':
                setDescription(inputValue);
                break;

            case 'price':
                setPrice(inputValue);
                break;

            case 'minPplCnt':
                if(maxPplCnt !== "" && inputValue > maxPplCnt){
                    setMinPplCntCorrect({
                        status:true,
                        message:`has to be smaller`
                    });
                }else {
                    setMinPplCntCorrect({
                        status:false,
                        message:""
                    });
                    setMaxPplCntCorrect({
                        status:false,
                        message:""
                    });

                }
                setMinPplCnt(inputValue);
                break;

            case 'maxPplCnt':
                if(minPplCnt !== "" && inputValue < minPplCnt){
                    setMaxPplCntCorrect({
                        status:true,
                        message:`has to be bigger`
                    });
                }else {
                    setMaxPplCntCorrect({
                        status:false,
                        message:""
                    });
                    setMinPplCntCorrect({
                        status:false,
                        message:""
                    });

                }
                setMaxPplCnt(inputValue);
                break;

            case 'sTime':
                if(eTime !== "" && typeof inputValue !== 'undefined' ){
                    let inputParts = inputValue.split(":");
                    let eTimeParts = eTime.split(":");
                    if (inputParts[0] > eTimeParts[0]) {
                        setSTimeCorrect({
                            status:true,
                            message:`Start time has to be smaller`
                        });
                    }else if(inputParts[0] === eTimeParts[0]){
                        if(inputParts[1] > eTimeParts[1]){
                            setSTimeCorrect({
                                status:true,
                                message:`Start time has to be smaller`
                            });
                        }else {
                            setETimeCorrect({
                                status:false,
                                message:""
                            });
                            setSTimeCorrect({
                                status: false,
                                message: ``
                            });
                        }
                    }else {
                        setETimeCorrect({
                            status:false,
                            message:""
                        });
                        setSTimeCorrect({
                            status: false,
                            message: ``
                        });
                    }
                }else {
                    setETimeCorrect({
                        status:false,
                        message:""
                    });
                    setSTimeCorrect({
                        status: false,
                        message: ``
                    });

                }
                setStime(inputValue);
                break;

            case 'sDate':

                if(eDate !== ""){
                    let inputDate = new Date(inputValue);
                    let enddate = new Date(eDate);
                    if(enddate.getTime() !== 0
                        && inputDate.getTime() > enddate.getTime()){
                        setSDateCorrect({
                            status:true,
                            message:"Start has to be earlier"
                        });
                    }else {
                        setEDateCorrect({
                            status:false,
                            message:""
                        });
                        setSDateCorrect({
                            status: false,
                            message: ``
                        });
                    }
                }else
                {
                    setSDateCorrect({
                        status:false,
                        message:""
                    });
                    setEDateCorrect({
                        status: false,
                        message: ``
                    });
                }
                setSDate(inputValue);
                break;

            case 'eTime':
                if(sTime !== "" && typeof inputValue !== 'undefined') {
                    let inputParts = inputValue.split(":");
                    let eTimeParts = sTime.split(":");
                    if (inputParts[0] < eTimeParts[0]) {
                        setETimeCorrect({
                            status: true,
                            message: `End time has to be bigger`
                        });
                    } else if (inputParts[0] === eTimeParts[0]) {
                        if (inputParts[1] < eTimeParts[1]) {
                            setETimeCorrect({
                                status: true,
                                message: `End time has to be bigger`
                            });
                        }else {
                            setETimeCorrect({
                                status:false,
                                message:""
                            });
                            setSTimeCorrect({
                                status: false,
                                message: ``
                            });
                        }
                    }else{
                        setETimeCorrect({
                            status: false,
                            message: ``
                        });
                        setSTimeCorrect({
                            status:false,
                            message:""
                        });
                    }
                }else {
                    setETimeCorrect({
                        status:false,
                        message:""
                    });
                    setSTimeCorrect({
                        status: false,
                        message: ``
                    });
                }

                setEtime(inputValue);
                break;

            case 'eDate':
                if(eDate !== ""){
                    let inputDate = new Date(inputValue);
                    let enddate = new Date(eDate);
                    if(enddate.getTime() !== 0
                        && inputDate.getTime() < enddate.getTime()){
                        setEDateCorrect({
                            status:true,
                            message:"End has to be later"
                        });
                    }else {
                        setEDateCorrect({
                            status:false,
                            message:""
                        });
                        setSDateCorrect({
                            status: false,
                            message: ``
                        });
                    }
                }else
                {
                    setEDateCorrect({
                        status:false,
                        message:""
                    });
                    setSDateCorrect({
                        status: false,
                        message: ``
                    });
                }

                setEDate(inputValue);
                break;

            case 'newCategory':
                setNewCategory(inputValue);
                break;

            default:
                break;
        }

    };

    let checkErrors = () => {
        if (minPplCntCorrect.status) {
            return true;
        } else if (maxPplCntCorrect.status) {
            return true;
        } else if (sDateCorrect.status) {
            return true;
        } else if (eDateCorrect.status) {
            return true;
        } else if (sTimeCorrect.status) {
            return true;
        } else if (eTimeCorrect.status) {
            return true;
        } else if(priceType == null){
            return true;
        }else {

            return false;
        }
    }

    let onOtherCategory = (e) =>{
        e.preventDefault();
        if(displayOther === false){
            setDisplayOther(true)
        }else {
            setDisplayOther(false)
        }

    };

    let showOtherCategory = () =>{
        if(displayOther === false){
           return "none"
        }else {
            return ""
        }
    };

    let checkCategory = (event) => {
        let value = event.target.value;
        let cat = categories.find((element) => element.name === value);


        if(typeof cat !== 'undefined'){
            categories.find((element) => element.name === value).checked =
                !categories.find((element) => element.name === value).checked ;
        }
    };

    let mapCategories  = () =>{
         return categories.map(cat => (

            <FormControlLabel
                id={cat.id}
                value={cat.name}
                control={<Checkbox color="primary" />}
                label={cat.name}
                labelPlacement="end"
                onClick={(event) => checkCategory(event) }
            />

         )).filter(cat => cat.props.id !== 999 );
     };

    const handleChangePriceType = (event) => {
        setPriceType(event.target.value);
    };

    const handleClosePriceType = () => {
        setOpenPriceType(false);
    };

    const handleOpenPriceType = () => {
        setOpenPriceType(true);
    };

    let mapPricceTypes = () =>{




    };

    const classes = useStyles();

    useEffect(() => {

         getAllCategories().then(
             (r) => {

                 setCategories(r.filter(cat => cat.valid).map( cat => ({
                     id:cat.id,
                     name:cat.name,
                     checked:false
                 })))
             });

        getPriceTypes().then( unmapedPticeTypes =>{
            setPriceTypes(
                unmapedPticeTypes.map(priceType =>
                    (
                        <MenuItem value={priceType.name}>{priceType.name}</MenuItem>
                    ))
            );
            // setPriceType(unmapedPticeTypes[0].name);

        });


    }, []);


    let categorieElements = mapCategories();

    return(
        <div>

        <FormControl component="fieldset" onSubmit={submit}>
            <FormLabel component="legend">Create service</FormLabel>
            <FormGroup aria-label="position" >

                <TextField id="Name"
                           label="Name"
                           value={name}
                           onChange={(event) => onChange(event)}
                />

                <TextField id="Description"
                           label="Description"
                           value={description}
                           onChange={(event) => onChange(event)}
                />


                <FormGroup aria-label="position" row>
                    {categorieElements}
                </FormGroup>


                <FormControlLabel
                    onClick={onOtherCategory}
                    id="999"
                    value="Other"
                    control={<Checkbox checked={displayOther} color="primary" />}
                    label="Other"
                    labelPlacement="end"
                />
                <TextField id="newCategory"
                           label="Other category Name"
                           value={newCategory}
                           onChange={(event) => onChange(event)}
                           style={{display:showOtherCategory()}}
                />
                <FormGroup aria-label="position" row>
                    <TextField id="price"
                               label="Displayed Price"
                               type={"number"}
                               value={price}
                               onChange={(event) => onChange(event)}
                               InputProps={{
                                   endAdornment: <InputAdornment position="start">&euro; Per</InputAdornment>,
                               }}
                    />

                    <TextField
                        select
                        label="Price Type"
                        id="price_types"
                        error={priceType === null}
                        value={priceType}
                        open={openPriceType}
                        className={classes.select}
                        onClose={handleClosePriceType}
                        onOpen={handleOpenPriceType}
                        onChange={handleChangePriceType}

                    >
                        {priceTypes}

                    </TextField>
                </FormGroup>
                <FormGroup aria-label="position" row>
                    <TextField id="minPplCnt"
                               type={"number"}
                               label="Mim people count"
                               error={minPplCntCorrect.status}
                               helperText={minPplCntCorrect.message}
                               value={minPplCnt}
                               onChange={(event) => onChange(event)}
                    />

                    <TextField id="maxPplCnt"
                               type={"number"}
                               label="Max people count"
                               error={maxPplCntCorrect.status}
                               helperText={maxPplCntCorrect.message}
                               value={maxPplCnt}
                               onChange={(event) => onChange(event)}
                    />
                </FormGroup>

                <FormGroup aria-label="position" row>

                    <TextField
                        id="sDate"
                        label="Start Date"
                        error={sDateCorrect.status}
                        helperText={sDateCorrect.message}
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
                               error={sTimeCorrect.status}
                               helperText={sTimeCorrect.message}
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
                        error={eDateCorrect.status}
                        helperText={eDateCorrect.message}
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
                               error={eTimeCorrect.status}
                               helperText={eTimeCorrect.message}
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
                <br/>
                <DropZone  files={files}
                           setFiles={setFiles} />

                <Button disabled={checkErrors()}
                        color="primary"
                        variant="contained"
                        onClick={submit}
                >Submit</Button>

            </FormGroup>
        </FormControl>


        </div>
    );

}

