import React, {useState} from "react";
import '../loginPage/login.css'
import {login} from  '../../utils/APIUtils.js'
import { useHistory } from 'react-router-dom'
import {getCurrentUser} from "../../utils/APIUtils";
import {useDispatch} from "react-redux";
import {setUser} from "../../redux/actions";
import SocialLogin from "../sociallogin/SocialLoginFile";
import {ACCESS_TOKEN} from "../../constants";

export default function LoginForm({close}) {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const history = useHistory();
    const dispatch = useDispatch();

    let submitLogin =  (event)=>{

        event.preventDefault();
        login({password, email}).then(
            () => getCurrentUser(dispatch)

        );


        close(event);
    };

    let handleChanges = (event) =>{
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        switch (inputName) {
            case "email":
                setEmail(inputValue);
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
                    onClick={submitLogin}

                >Login</button>

                <SocialLogin/>

                {/*<button*/}
                {/*    type="button"*/}
                {/*    className="login-btn-google"*/}
                {/*    onClick={googleOauth2}*/}

                {/*>Google</button>*/}

                {/*<button*/}
                {/*    type="button"*/}
                {/*    className="login-btn-facebook"*/}
                {/*    onClick={facebookOauth2}*/}

                {/*>Facebook</button>*/}

            </div>
        </div>
    );
}