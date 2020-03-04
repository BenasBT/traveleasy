import React, {useState} from "react";
import '../../pages/loginPage/login.css'
import {login} from  '../../utils/APIUtils.js'
import { useHistory } from 'react-router-dom'
import {getCurrentUser} from "../../utils/APIUtils";
import {useDispatch} from "react-redux";
import {setUser} from "../../redux/actions";

export default function LoginForm({close}) {

    const [usernameOrEmail,setUsernameOrEmail] = useState("");
    const [password,setPassword] = useState("");

    const history = useHistory();
    const dispatch = useDispatch();

    let submitLogin =  (event)=>{
        event.preventDefault();
        login({password, usernameOrEmail});
        const user = getCurrentUser();
        user.then(r => { dispatch(setUser(r)) });
        close(event);

    };

    let googleOauth2 =  (event)=>{
        event.preventDefault();
        login({password, usernameOrEmail});
        const user = getCurrentUser();
        user.then(r => { dispatch(setUser(r)) });
        close(event);

    };

    let facebookOauth2 =  (event)=>{
        event.preventDefault();
        login({password, usernameOrEmail});
        const user = getCurrentUser();
        user.then(r => { dispatch(setUser(r)) });
        close(event);

    };

    let handleChanges = (event) =>{
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        switch (inputName) {
            case "usernameOrEmail":
                setUsernameOrEmail( inputValue);
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
                    onClick={submitLogin}

                >Login</button>

                <button
                    type="button"
                    className="login-btn-google"
                    onClick={googleOauth2}

                >Google</button>

                <button
                    type="button"
                    className="login-btn-facebook"
                    onClick={facebookOauth2}

                >Facebook</button>

            </div>
        </div>
    );
}