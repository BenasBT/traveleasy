import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {red} from "@material-ui/core/colors";



const useStyles = makeStyles(theme => ({
    list: {
        width: 250,

    }
}));

export default function CartDrawer ({open,handleClose}) {
    const classes = useStyles();

    const sideList =
        <div
            className={classes.list}
        >
            <List>
                {['Activity 1', 'Activity 2', 'Activity 3', 'Activity 4'].map((text, index) => (
                    <div>
                        <ListItem button key={text}>

                            <ListItemText primary={text} />
                        </ListItem>
                        <Divider/>
                    </div>


                ))}

            </List>

        </div>
    ;

    return(
        <Drawer anchor='right' open={open} onClose={handleClose}>
            {sideList}
        </Drawer>
    )
}