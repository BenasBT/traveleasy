import React, {useEffect, useState} from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import {SenddeleteEvent, getUserPurchases, deletePurchaseEvent,deletePurchase} from "../../utils/APIUtils";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Collapse,
    Typography
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({

    root:{
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 400,

    },
    card: {
        padding: "10px",
        border: "1px solid "

    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {

        backgroundColor: 'inherit',
        padding: 0,
        align:"center"
    },
    center:{
        margin: "auto",
    },
    p_root: {
        maxWidth: 345,
    },
    image:{
        margin: "auto",
        align:"center",
        "max-height": "180px",
        "max-width": "300px",
        // height: 180,
        // width: 300,

    },
    info :{
        margin:'auto',
        textAlign: 'center',
        width: '50%'
    },

}));
export default function MyOrders() {

    const [orders, setOrders] = useState([]);
    const [state, forceState] = useState(false);

    const classes = useStyles();
    const [thumb, setThumb] = useState(0);

    let nextPhoto = (event) =>{

        if(thumb < event.service.service_photo.length -1){
            setThumb(thumb +1);
        }else {
            setThumb(0);
        }

    };

    let onCancelClick = (e,event) => {
        e.preventDefault();
        console.log("cancel event");
        console.log(event);
        let tempOrder  =  orders.find((o) => o.id === event.purchase);
        deletePurchaseEvent(event.id).then((r) => {
            let index = orders.indexOf(tempOrder);
            if (index > -1) {
                let tempEvent  =  orders[index].events.find((e) => e.id === event.id);
                let eventIndex = orders[index].events.indexOf(tempEvent);
                console.log(orders);
                console.log(index);
                console.log(event);
                if (index > -1) {
                    orders[index].events.splice(eventIndex, 1);
                }

            }
        forceState(!state);

        });

    };

    let onCancelOrderClick = (event,order_id) =>{
        event.preventDefault();
        console.log("cancel event with id " + order_id.id );
        let tempOrder  =  orders.find((e) => e.id === order_id.id);
        deletePurchase(order_id.id).then((r) => {
            let index = orders.indexOf(tempOrder);
            if (index > -1) {
                orders.splice(index, 1);
            }
            forceState(!state);
        });

    };

    let ServicesMedia = (event,photo) =>{

        return  (
            <CardMedia className={classes.image}
                       component="img"
                       alt={photo.name}
                       image={"http://localhost:3001/api/photo/" + photo.id}
                       title={photo.name}
                       onClick={() => nextPhoto(event)}
            />
        )
    };

    let categories = (event) =>{

        return  (
            event.service.service_category.filter((category => category.valid))
                .map( category => (
                    <Grid item xs={6}>
                        <Card>
                            <CardActionArea>
                                {category.name}
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))
        )
    };

    let mappedEvents =(events,show) =>{
        return events.map((event,index) => (

            <Collapse in={show} >
                    <Card className={classes.card}>
                        <CardActions>
                            {event.service.service_photo.length> 0 ? ServicesMedia(event,event.service.service_photo[thumb]) : null}
                        </CardActions>

                        <CardContent className={classes.info} >
                            <Typography gutterBottom variant="h2" component="h2" >
                                {event.service.name}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {event.service.description}
                            </Typography>
                            <Divider   />
                            <Typography gutterBottom variant="body2" component="h2">
                                Price: {event.service.price} &euro; per {event.service.price_type}
                            </Typography>
                            <Typography gutterBottom variant="body2" component="h2">
                                Full Price: {event.price} &euro;
                            </Typography>
                            <Divider   />
                            Categories:
                            <Grid container spacing={3}>
                                {categories(event)}
                            </Grid>
                            <Divider   />

                            {event.start_date ?
                                <Typography variant="body2" gutterBottom>
                                    Start Date: {event.start_date}
                                </Typography> : null}
                            {event.end_date ?
                                <Typography variant="body2" gutterBottom>
                                    End Date: {event.end_date}
                                </Typography> : null}

                            {event.start_time ?
                                <Typography variant="body2" gutterBottom>
                                    Start Time: {event.start_time}
                                </Typography>: null}
                            {event.end_time ?
                                <Typography variant="body2" gutterBottom>
                                    End Time: {event.end_time}
                                </Typography> : null}

                            {event.people_count !== 0 ?
                                <Typography variant="body2" gutterBottom>
                                    People:  {event.people_count !== 0 ?  `${event.people_count}`
                                    : null}
                                </Typography>
                                :null}
                            <Divider/>
                            <Typography variant="body2" gutterBottom>
                                {event.provider.email ? <Typography variant="body2" gutterBottom>
                                    Contact Email: {event.provider.email}
                                </Typography> : null}
                                {event.provider.phone ?<Typography variant="body2" gutterBottom>
                                    Contact Phone: {event.provider.phone}
                                </Typography> : null}
                            </Typography>

                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary" onClick={e => onCancelClick(e,event)}>
                                Remove Event
                            </Button>
                        </CardActions>
                    </Card>
            </Collapse>

        ))

    };
    let openData = (event,order) => {
        event.preventDefault();
        let index = orders.indexOf(order);
        if(index !== -1){
            orders[index].show = !orders[index].show;
        }
        forceState(!state);
    };

    let mappedOrders = () => {
      return orders.map((order) =>(
          <Card>
              <CardContent>
                  <ListItem button onClick={event => openData(event,order)}>
                      <Typography gutterBottom variant="body1" component="h2" >
                          ID {order.id} Order price {order.price}
                      </Typography>
                  </ListItem>

                  {order.show ?   <ExpandLess /> : <ExpandMore />}
                  <Divider/>
                  {mappedEvents(order.events,order.show)}
              </CardContent>
              <CardActions>
                  <Button size="small" color="primary" onClick={event => onCancelOrderClick(event,order)}>
                      Remove Order
                  </Button>
              </CardActions>
              <li key={order.id} className={classes.listSection}>
                    <ul className={classes.ul}>

                    </ul>
                </li>
          </Card>
      ) )
    };

    useEffect(() => {

        getUserPurchases().then(r => {
            setOrders(
                    r.map((r) => {
                    var o = Object.assign({}, r);
                    o.show = false;
                    return o;
                }
            ));

        })

    }, []);

    return (
        <div>
            <p>My Orders: </p>
            <List className={classes.root} subheader={<li />}>
                {orders.length > 0 ? mappedOrders() : <p>test</p>}

            </List>
        </div>

    );
}