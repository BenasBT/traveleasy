import React,{useEffect} from "react";
import {useParams} from 'react-router-dom'
import {useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {Card,CardMedia,CardContent,Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 345,
    },
    image :{
        display:'block',
        marginLeft:'auto',
        marginRight:'auto',
        width: '25%',
        borderRadius: 50,
        height: 'auto',



    },
    info :{
        margin:'auto',
        textAlign: 'center',
        width: '50%'
    },


}));


export default function Servicce() {
    //Picture if exist else some defoult picture
    //Display data


    let {id} = useParams();
    //let serveice = getServiceInfo(id);

    let serveice ={
        providerId : 100,
        imageUrl : '/home/anthon/Projects/traveleasy/ftp/vecation1.jpeg',
        name : 'atostogos',
        description : 'geras labai fainai'
    };

    //let provider = getProviderInfo(serveice.providerId);
    let provider = {
        phone: '+37066323152',
        email: 'test@gmail.com'
    };

    const currentUser = useSelector(state => state.currentUserReducer);
    const classes = useStyles();

    return(
        <div>
            {currentUser ?
                <Card className="service">
                    {
                        serveice.imageUrl ? (
                            <img alt={serveice.name}
                                 src={serveice.imageUrl}
                                 className={classes.image}
                            />



                        ) :null
                    }

                    <CardContent className={classes.info}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {serveice.name}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="h2">
                            {provider.email ?<p>Email: {provider.email}</p> : null}
                            {provider.phone ?<p>Phone: {provider.phone}</p> : null}
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