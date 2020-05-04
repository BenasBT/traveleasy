import React,{useEffect} from "react";
import {useParams} from 'react-router-dom'
import {useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {Card,CardMedia,CardContent,Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 345,
    },
    profile_image :{
        display:'block',
        marginLeft:'auto',
        marginRight:'auto',
        width: '25%',
        borderRadius: 50,
        height: 'auto',



    },
    profile_info :{
        margin:'auto',
        textAlign: 'center',
        width: '50%'
    },


}));


export default function Profile() {
    //Picture if exist else some defoult picture
    //Display data


    let {id} = useParams();

    const currentUser = useSelector(state => state.currentUserReducer);
    const classes = useStyles();

    return(
        <div>
            {currentUser ?
                <Card className="profile">
                    {
                        currentUser.imageUrl ? (
                                <img alt={currentUser.name}
                                    src={currentUser.imageUrl}
                                    className={classes.profile_image}
                                />



                        ) :null
                    }

                    <CardContent className={classes.profile_info}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {currentUser.name}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="h2">
                            Email: {currentUser.email}
                        </Typography>
                        {}
                        <Typography variant="body2" color="textSecondary" component="p">
                        </Typography>
                    </CardContent>

                </Card>

            :
                <p>not loaded</p>
            }





        </div>
    );

}