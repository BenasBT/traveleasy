import React, {useState} from "react";
import '../loginPage/login.css'
import {getCurrentUser, login, register} from "../../utils/APIUtils";
import {useDispatch} from "react-redux";
export default function RegisterForm ({close}) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    let submitRegister =  (event)=>{
        event.preventDefault();
        register({name, email, password}).then(
            () => login({password,email}).then(
                () => getCurrentUser(dispatch).then( close(event) )
            )
        );


    };

    let handleChanges = (event) =>{
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        switch (inputName) {
            case "name":
                setName( inputValue);
                break;
            case "email":
                setEmail( inputValue);
                break;
            case "password" :
                setPassword(inputValue);
                break;
        }
    };

    return(
        <div className="inner-container">
            <div className="header">
                Register
            </div>
            <div className="box">

                <div className="input-group">
                    <label htmlFor="name">name</label>
                    <input
                        type="text"
                        name="name"
                        className="login-input"
                        placeholder="Name"
                        onChange={(event => handleChanges(event))}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        className="login-input"
                        placeholder="Email"
                        onChange={(event => handleChanges(event))}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="login-input"
                        placeholder="Password"
                        onChange={(event => handleChanges(event))}
                    />
                </div>
                <button
                    type="button"
                    className="login-btn"
                    onClick={submitRegister}
                >Register</button>
            </div>
        </div>
    );
}