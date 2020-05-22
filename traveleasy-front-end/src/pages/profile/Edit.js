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
import {editUserDate, getAllCategories, getPriceTypes, getService} from "../../utils/APIUtils";
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

export default function Edit({open,handleClose,user}) {


    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [provider, setProvider] = useState("");
    const classes = useStyles();


    let submit = (event) =>{
        event.preventDefault();
        const editRequest = {

            name:name,
            email:email
        };
        console.log(editRequest);
        editUserDate(editRequest).then( (r) => {
        });
    };

    let onChange = (event) => {

        const inputId = event.target.id;
        const inputValue = event.target.value;


        switch(inputId) {

            case 'name':
                setName(inputValue);
                break;

            case 'email':
                setEmail(inputValue);
                break;

            default:
                break;
        }

    };

    useEffect(() => {
        console.log(user);
        setEmail(user.email);
        setName(user.name);
        setProvider(user.provider);

    }, [user]);

    return(
        <MyModal modalHeader={`Edit ${user.name} data`} open={open} handleClose={handleClose}>
            <Card>
                <FormControl component="fieldset" onSubmit={submit}>
                    <FormGroup aria-label="position" >


                        <TextField id="name"
                                   label="Name"
                                   value={name}
                                   onChange={(event) => onChange(event)}
                        />
                        <TextField id="email"
                                   error={provider !== "local"}
                                   helperText={provider !== "local" ? "Can't change email" +
                                       " because you're using " + provider : null}
                                   label="Email"
                                   value={email}
                                   onChange={(event) => onChange(event)}
                        />

                        <br/>

                        <CardActions>
                            <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={submit}
                            >Edit</Button>

                            <Button
                                    color=""
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