import React, {useEffect, useState} from "react";
import DropZone from "../../components/dropzone/DropZone";
import {useSelector} from "react-redux";
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
    addService,
    addServiceFiles,
    getService,
    editService,
    deletePhoto
} from '../../utils/APIUtils'
import {useHistory, useParams} from 'react-router-dom';
import {CardActions, Card, Typography} from "@material-ui/core";
import MyModal from "../../components/modal/MyModal";


export default function EditService() {

    const currentUser = useSelector(state => state.currentUserReducer);

    const [service, setService] = useState();
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
    const [state, forceStateUpdate] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);
    const [deletePhotoId, setDeletePhotoId] = useState(0);

    const useStyles = makeStyles((theme) => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
    }));

    const history = useHistory();
    const classes = useStyles();
    let { id } = useParams();

    const thumb = {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: 'border-box'
    };

    const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    };

    const img = {
        display: 'block',
        width: 'auto',
        height: '100%'
    };

    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16
    };



    let submit = (event) => {
        event.preventDefault();

        let checkedCategories = categories.filter( category => category.checked)
            .map((category => ({id: category.id, name: category.name})));

        const addRequest = {
            id:service.id,
            name: name,
            description: description,

            categories:checkedCategories,
            newCategoryChecked:displayOther,
            newCategory:newCategory,

            price: price,

            start_date:sDate,
            start_time:sTime,
            end_time:eTime,
            end_date:eDate,

            min_people_count: minPplCnt,
            max_people_count: maxPplCnt,
        };


        if(addRequest.max_people_count === ''){
            addRequest.max_people_count = 0;
        }
        if(addRequest.min_people_count === ''){
            addRequest.min_people_count = 0;
        }
        if(addRequest.price === ''){
            addRequest.price =0;
        }
        if(addRequest.start_date == null){
            addRequest.start_date = "";
        }
        if(addRequest.end_date == null){
            addRequest.end_date = "";
        }

        console.log(addRequest);

        const formData = new FormData();

        for(let i = 0; i< files.length; i++) {
            formData.append('file', files[i]);
        }

        formData.set('data',JSON.stringify(addRequest));

        editService(formData).then();

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
                setMinPplCnt(inputValue);
                break;

            case 'maxPplCnt':
                setMaxPplCnt(inputValue);
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

            case 'newCategory':
                setNewCategory(inputValue);
                break;

            default:
                break;
        }

    };

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
        forceStateUpdate(!state); //TODO: fix me

    };

    let mapCategories  = () =>{
        return categories.map(cat => (

            <FormControlLabel
                id={cat.id}
                value={cat.name}
                control={<Checkbox checked={cat.checked}  color="primary" />}
                label={cat.name}
                labelPlacement="end"
                onClick={(event) => checkCategory(event) }
            />

        )).filter(cat => cat.props.id !== 999 );
    };


    let openDeletePhoto = (event) => {
        event.preventDefault();
        setDeletePhotoId(event.target.id);
        setOpenDelete(true);
    };

    let handleClose = (event) =>{
        event.preventDefault();
        setOpenDelete(false);
    };

    let handleDelete = (event) => {
        event.preventDefault();
        deletePhoto(deletePhotoId).then(r =>{

            let tempDeletePhoto  = service.service_photo.find((photo) => photo.id == deletePhotoId);
            let index = service.service_photo.indexOf(tempDeletePhoto);

            if (index > -1) {
                service.service_photo.splice(index, 1);
            }
            forceStateUpdate(!state);
            handleClose(event);
        });


    };

    let mapPhotos  = () =>{
        if(typeof service !== 'undefined'){
        return service.service_photo.map(photo => (

        <div  style={thumb} key={photo.name} onClick={ (event) => openDeletePhoto(event)}>
            <div style={thumbInner}>
                <img
                    id={photo.id}
                    src={"http://localhost:3001/api/photo/" + photo.id}
                    style={img}
                />
            </div>
        </div>
        ));
        }else return null;
    };

    useEffect(() => {
        getService(id).then(
            service =>
            {
                getAllCategories().then(
                    (r) => {
                        let tempCategories = r.map( cat => ({
                            id:cat.id,
                            name:cat.name,
                            checked:false
                        }));
                        service.service_category.forEach((serviceCat) => {
                            tempCategories.forEach((tempCat) => tempCat.id === serviceCat.id ? tempCat.checked = true : null)
                        });

                        setCategories(tempCategories);
                    }
                ).then(()=>{

                    setService(service);
                    setName(service.name);
                    setDescription(service.description);
                    setPrice(service.price);
                    setMinPplCnt(service.min_people_count);
                    setMaxPplCnt(service.max_people_count);
                    setSDate(service.start_date);
                    setStime(service.start_time);
                    setEDate(service.end_date);
                    setEtime(service.end_time);
                    }

                );



            }
        );

    }, []);


    let ConfirmDelete = () =>{
        return(
        <MyModal modalHeader={"Are you sure ?"} open={openDelete} handleClose={handleClose}>
            <Card>

            <Typography variant="body2" gutterBottom>
                Are you sure you want to remove this photo ?
            </Typography>
            <div  style={thumb} >
                <div style={thumb}>
                    <img
                        id={deletePhotoId}
                        src={"http://localhost:3001/api/photo/" + deletePhotoId}
                        style={img}
                    />
                </div>
            </div>
            <CardActions>
                <Button
                    variant="contained"
                    onClick={handleClose}
                    >Cancel</Button>

                <Button color="primary"
                        variant="contained"
                        onClick={event => handleDelete(event)}

                >Delete</Button>
            </CardActions>
            </Card>
        </MyModal>
        );
    };

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
                        {mapCategories()}
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

                    <TextField id="price"
                               label="Displayed Price"
                               value={price}
                               onChange={(event) => onChange(event)}
                    />

                    <FormGroup aria-label="position" row>
                        <TextField id="minPplCnt"
                                   label="Mim people count"
                                   value={minPplCnt}
                                   onChange={(event) => onChange(event)}
                        />

                        <TextField id="maxPplCnt"
                                   label="Max people count"
                                   value={maxPplCnt}
                                   onChange={(event) => onChange(event)}
                        />
                    </FormGroup>

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
                    <br/>
                    <DropZone  files={files}
                               setFiles={setFiles} />

                    <Typography variant="body2" gutterBottom>
                        Click on uploaded picture to remove it :
                    </Typography>

                    <aside style={thumbsContainer}>

                        {mapPhotos()}
                    </aside>

                    {ConfirmDelete()}

                    <Button color="primary"
                            variant="contained"
                            onClick={submit}
                    >Submit</Button>

                </FormGroup>
            </FormControl>


        </div>
    );

}

