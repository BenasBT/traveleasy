import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import {useDispatch, useSelector} from "react-redux";
import {ACCESS_TOKEN} from "../../../constants";
import {clearUser, setUser} from "../../../redux/actions";
import {useHistory} from "react-router-dom";


const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});


export default function UserDrawer ({open,handleClose}) {
    const classes = useStyles();
    const currentUser = useSelector(state => state.currentUserReducer);
    const dispatch = useDispatch();
    const history = useHistory();

    let onLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem(ACCESS_TOKEN);
        dispatch(clearUser())
        console.log("Logout");
        handleClose();
    };

    let onAdmin = (event) => {
        event.preventDefault();

        console.log("onAdmin");
        history.push("/admin");

    };

    let onMyProfile = (event) => {
        event.preventDefault();
        console.log("onMyProfile");
        history.push("/profile/me");

    };

    let onAddService = (event) => {
        event.preventDefault();
        console.log("onAddService");
        history.push("/service/add");

    };

    let isAdmin = (currentUser) => {
        if(currentUser) {
            let a = currentUser.roleEntities;
            for(let i = 0; i < currentUser.roleEntities.length; i ++){
                if(a[i].name === 'ROLE_ADMIN')
                    return true;
            }
        }
        return false;
    };

    const sideList =
        <div
            className={classes.list}
        >
            <List>
                <ListItem>
                    <Button onClick={onMyProfile}>
                        <Typography align="center" className={classes.title}>
                            Profile
                        </Typography>
                    </Button>
                </ListItem>
                <ListItem>
                    <Button onClick={onAddService}>
                        <Typography align="center" className={classes.title}>
                            Add Service
                        </Typography>
                    </Button>
                </ListItem>
                {isAdmin(currentUser) ?
                <ListItem>
                    <Button onClick={onAdmin}>
                        <Typography align="center" className={classes.title}>
                            Admin
                        </Typography>
                    </Button>
                </ListItem>
                : null
                }
                <ListItem>
                    <Button onClick={onLogout}>
                        <Typography align="center" className={classes.title}>
                            Logout
                        </Typography>
                    </Button>
                </ListItem>

            </List>


        </div>
    ;

    return(
        <Drawer anchor='right' open={open} onClose={handleClose}>
            {sideList}
        </Drawer>
    )
}