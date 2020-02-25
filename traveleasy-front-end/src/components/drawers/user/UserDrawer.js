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
import {useSelector} from "react-redux";


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

    let onLogout = (eve) => {
        console.log("Logout");
        handleClose();
    };

    let isAdmin = (currentUser) => {
        if(currentUser) {
            let a = currentUser.authorities;
            for(let i = 0; i < currentUser.authorities.length; i ++){
                if(a[i].authority === 'ROLE_ADMIN')
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
                    <Button onClick={onLogout}>
                        <Typography align="center" className={classes.title}>
                            Profile
                        </Typography>
                    </Button>
                </ListItem>
                {isAdmin(currentUser) ?
                <ListItem>
                    <Button onClick={onLogout}>
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