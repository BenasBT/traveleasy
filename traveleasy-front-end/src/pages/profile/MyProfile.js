import React from "react";
import Profile from "./Profile";
import {useSelector} from "react-redux";
import {List,Card, CardActionArea,CardMedia,CardContent, Typography} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});
export default function MyProfile() {

    const classes = useStyles();

    return(

        <div>

            <Profile />


    <p>history</p>
            <List className="purchase-history">

                <Card>
                    <CardActionArea>
                        <CardMedia
                            className={classes.media}
                            image="https://lh3.googleusercontent.com/a-/AOh14GhPUr4Z5NHMUXvlbLsdFfC3bebHhA2S56aOgfdOGg"
                            title="Contemplative Reptile"
                        />
                    </CardActionArea>
                </Card>


                <Card>
                    <CardActionArea>
                        <CardMedia
                            className={classes.media}
                            image="https://lh3.googleusercontent.com/a-/AOh14GhPUr4Z5NHMUXvlbLsdFfC3bebHhA2S56aOgfdOGg"
                            title="Contemplative Reptile"
                        />
                    </CardActionArea>
                </Card>

                <Card>
                    <CardActionArea>
                        <CardMedia
                            className={classes.media}
                            image="https://lh3.googleusercontent.com/a-/AOh14GhPUr4Z5NHMUXvlbLsdFfC3bebHhA2S56aOgfdOGg"
                            title="Contemplative Reptile"
                        />
                    </CardActionArea>
                </Card>

            </List>



        </div>


    );
    // edit
    //purchase history

}