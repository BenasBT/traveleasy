import React, {useState} from "react";
import DropZone from "../../components/dropzone/DropZone";
import {useSelector} from "react-redux";

export default function AddService() {

    const currentUser = useSelector(state => state.currentUserReducer);
    const [name, setName] = useState("");
    const [description,setDescription ] = useState("");
    const [categories,setCategories ] = useState("");
    const [price,setPrice ] = useState(0);
    const [minPplCnt,setMinPplCnt] = useState(0);
    const [maxPplCnt,setMaxPplCnt] = useState(0);

    let submit = () => {

    };

    let onChange = () => {

    };
    return(
        <div>
        <p>Add Service Page</p>
            <form onSubmit={submit}>

                <input
                    type="text"
                    name="fname"
                    value={name}
                    onChange={onChange}
                />
                <input
                    type="text"
                    name="lname"
                    value={description}
                    onChange={onChange}
                />

                <input
                    type="text"
                    name="email"
                    value={categories}
                    onChange={onChange}
                />

                <input
                    type="text"
                    name="email"
                    value={price}
                    onChange={onChange}
                />

                <input
                    type="text"
                    name="email"
                    value={minPplCnt}
                    onChange={onChange}
                />

                <input
                    type="text"
                    name="email"
                    value={maxPplCnt}
                    onChange={onChange}
                />

                <button type="submit">Submit</button>

            </form>
        <DropZone/>

        </div>
    );

}

