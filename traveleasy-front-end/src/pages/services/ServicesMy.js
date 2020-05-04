import React, {useEffect, useState} from "react";
import { getMyServices} from '../../utils/APIUtils';

import Service from "../../components/service";

export default function ServicesMy() {

    const [services, setServices] = useState([]);

    let mapServices = () =>{
        return services.map(
            (ser) => (
                <Service service={ser}/>
            )
        )

    };
    let mappedServices;
    useEffect(() => {
        getMyServices().then(r => {
            setServices(r);
        })

    }, []);

    if(services.length > 0){
        mappedServices = mapServices();
    }
    return(
        <div>
            <p>Services Page</p>
            {mappedServices}
        </div>

    );

}