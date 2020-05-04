import React, {useEffect, useState} from "react";
import {getServices} from '../../utils/APIUtils';
import Service from "../../components/service";

export default function Services() {

    const [services, setServices] = useState([]);


    let mapServices = () =>{
        console.log(services);
        if(services){
            return services.map(
                (ser) => (
                    <Service service={ser}/>
                )
            )
        }
        else return null;

    };
    let mappedServices;
    useEffect(() => {
        getServices().then(r => {
            setServices(r);
        })

    }, []);

    if(typeof services !== 'undefined'){
        mappedServices = mapServices();
    }
    return(
        <div>
            <p>My Services Page</p>
            {services ? mappedServices : null}
        </div>

    );

}