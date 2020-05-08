import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import {CardContent} from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
}));

export default function Filter({open, handleClose}) {
    const classes = useStyles();

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [minPplCnt, setMinPplCnt] = useState("");
    const [maxPplCnt, setMaxPplCnt] = useState("");

    const [sTime, setStime] = useState("");
    const [eTime, setEtime] = useState("");

    const [sDate, setSDate] = useState("");
    const [eDate, setEDate] = useState("");
    const [categories, setCategories] = useState([]);

    let onChange = (event) => {

        const inputId = event.target.id;
        const inputValue = event.target.value;

        switch (inputId) {

            case 'minPrice':
                setMinPrice(inputValue);
                break;

            case 'maxPrice':
                setMaxPrice(inputValue);
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

            default:
                break;
        }

    };

    let checkCategory = (event) => {
        let value = event.target.value;
        let cat = categories.find((element) => element.name === value);


        if (typeof cat !== 'undefined') {
            categories.find((element) => element.name === value).checked =
                !categories.find((element) => element.name === value).checked;
        }
    };

    let mapCategories = () => {
        return categories.map(cat => (

            <FormControlLabel
                id={cat.id}
                value={cat.name}
                control={<Checkbox color="primary"/>}
                label={cat.name}
                labelPlacement="end"
                onClick={(event) => checkCategory(event)}
            />

        )).filter(cat => cat.props.id !== 999);
    };

    let filter = (event) => {
        event.preventDefault();
        console.log("filter");
    };


    return (

        <Drawer open={open} onClose={handleClose}
                className={classes.drawer}
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
        >
            <div className={classes.toolbar}/>
            <List>
                <Typography gutterBottom variant="h5" component="h2">
                    Price
                </Typography>
                <ListItem>

                    <Divider/>
                    <TextField id="minPrice"
                               label="Min"
                               value={minPrice}
                               onChange={(event) => onChange(event)}
                    />

                    <TextField id="maxPrice"
                               label="Max"
                               value={maxPrice}
                               onChange={(event) => onChange(event)}
                    />
                </ListItem>
                <Divider/>
                <Typography gutterBottom variant="h5" component="h2">
                    People count
                </Typography>

                <ListItem>
                    <Divider/>
                    <TextField id="minPplCnt"
                               label="Min"
                               value={minPplCnt}
                               onChange={(event) => onChange(event)}
                    />

                    <TextField id="maxPplCnt"
                               label="Max"
                               value={maxPplCnt}
                               onChange={(event) => onChange(event)}
                    />
                </ListItem>
                <Divider/>

                <ListItem>
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
                </ListItem>
                <Divider/>
                <ListItem>
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
                </ListItem>
                <Divider/>
                <ListItem>
                    <Button color="primary"
                            variant="contained"
                            onClick={filter}
                    >Filter</Button>
                </ListItem>

            </List>
        </Drawer>

    );
}
