import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import {useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardMedia, CardContent, Typography, Button, CardActions} from "@material-ui/core";
import {getMyServices, getUser} from '../../utils/APIUtils';
import UserServices from "../services/UserServices";
import MarkedServices from "../services/MarkedServices";
import Archive from "./Archive";
import MyOrders from "./MyOrders";
import Edit from "./Edit";

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 345,
    },
    profile_image :{
        display:'block',
        marginLeft:'auto',
        marginRight:'auto',
        MaxWidth: '200',
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
    const [user, setUser] = useState([]);
    const [edit, setEdit] = useState(false);

    let openedit = () => {
      setEdit(true);
    };
    let closeedit = () => {
        setEdit(false);
    };
    //
    const classes = useStyles();

    let checkUser = (user) => {
        if(currentUser !== null && user !== null) {
            if (user.id === currentUser.id) {
                return true;
            }
        }
        return false

    };

    useEffect(() => {
        getUser(id).then(user => {
            setUser(user);
        });

    }, []);

    return(
        <div>
                <Card className="profile">
                    {
                        user.imageUrl ? (
                                <img alt={user.name}
                                    src={user.imageUrl}
                                    className={classes.profile_image}
                                />
                        ) :null
                    }

                    <CardContent className={classes.profile_info}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {user.name}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="h2">
                            Email: {user.email}
                        </Typography>
                        {checkUser(user) ? <Button
                                                   color="primary"
                                                   variant="contained"
                                                   onClick={openedit}
                                                    >Edit</Button>: null}
                        <Typography variant="body2" color="textSecondary" component="p">
                        </Typography>
                    </CardContent>

                    <UserServices/>
                    {checkUser(user) ? <MarkedServices/> : null}
                    {checkUser(user) ? <MyOrders/> : null}
                    {checkUser(user) ? <Archive/> : null}

                    <Edit open={edit} handleClose={closeedit} user={user}/>
                </Card>





        </div>
    );

}