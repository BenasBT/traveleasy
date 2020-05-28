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
import {sendCheckout} from "../../utils/APIUtils";


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function Checkout({events, open, handleClose,deleteEvents,price}) {


    const [cardNr, setCardNr] = useState("");
    const [expDate, setExpDate] = useState("");
    const [ccv, setCcv] = useState("");



    const classes = useStyles();

    let onChange = (e) => {

        const inputId = e.target.id;
        const inputValue = e.target.value;
        switch(inputId) {

            case 'cardNr':
                setCardNr(inputValue);
            break;

            case 'expDate':
                setExpDate(inputValue);
            break;

            case 'ccv':
                setCcv(inputValue);
            break;

            default:
                break;
        }
    };

    let checkout = (e) =>{
        e.preventDefault();
        let checkoutRequest ={
            events:events,
            price:price,
            card_number:cardNr,
            expiration_date:expDate,
            ccv_cvc:ccv

        };
        console.log(checkoutRequest);
        sendCheckout(checkoutRequest).then(
            deleteEvents(e)
        );
        handleClose()
    };

    let checkEvent = () =>{
        return Object.values(events).length >= 1

    };
    if(!checkEvent()){
        return null;
    }

    return(
        <MyModal modalHeader={`Checkout`} open={open} handleClose={handleClose}>
            <Card>
                <FormControl component="fieldset" >
                    <FormGroup aria-label="position" >

                        <TextField id="cardNr"
                                   label="Card number"
                                   value={cardNr}
                                   onChange={(event) => onChange(event)}
                        />
                        <TextField
                            id="expDate"
                            label="Expiration Date"
                            value={expDate}
                            onChange={(event) => onChange(event)}
                            type="date"
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField id="ccv"
                                   label="CCV/CVC"
                                   value={ccv}
                                   onChange={(event) => onChange(event)}
                        />

                        <CardActions>
                            <Button color="primary"
                                    variant="contained"
                                    onClick={e => checkout(e)}
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