import React, {useState} from "react";
import '../../pages/loginPage/login.css'
import {register} from "../../utils/APIUtils";
export default function RegisterForm ({close}) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let submitRegister =  (event)=>{
        event.preventDefault();
        register({username, email, password}).then(r  => close(event));

    };

    let handleChanges = (event) =>{
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        switch (inputName) {
            case "username":
                setUsername( inputValue);
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
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        className="login-input"
                        placeholder="Username"
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