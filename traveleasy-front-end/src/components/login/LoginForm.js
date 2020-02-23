import React, {useState} from "react";
import '../../pages/loginPage/login.css'
import {login} from  '../../utils/APIUtils.js'
import { useHistory } from 'react-router-dom'

export default function LoginForm({close}) {

    const [usernameOrEmail,setUsernameOrEmail] = useState("");
    const [password,setPassword] = useState("");

    const history = useHistory();

    let submitLogin =  (event)=>{
        event.preventDefault();
        login({password, usernameOrEmail}).then(r => close(event));

    };

    let handleChenges = (event) =>{
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        switch (inputName) {
            case "usernameOrEmail":
                setUsernameOrEmail( inputValue);;
                break;
            case "password" :
                setPassword(inputValue);
                break;
        }
    };

    return(
        <div className="inner-container">
            <div className="header">
                Login
            </div>
            <div className="box">

                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="usernameOrEmail"
                        className="login-input"
                        placeholder="Username Or Email"
                        onChange={(event => handleChenges(event))}
                    />

                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="login-input"
                        placeholder="Password"
                        onChange={(event => handleChenges(event))}
                    />
                </div>

                <button
                    type="button"
                    className="login-btn"
                    onClick={submitLogin}

                >Login</button>

            </div>
        </div>
    );
}