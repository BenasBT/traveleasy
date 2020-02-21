import React from "react";
import MyModal from "../../components/modal";
import LoginBox from "../../components/login";
import RegisterBox from "../../components/register";
import '../../pages/loginPage/login.css'

export default function LoginPage({open,handleClose}) {
    const [openLogin, setOpenLogin] = React.useState(true);
    const [openRegister, setOpenRegister] = React.useState(false);


    let showLoginBox = (event) => {
        event.preventDefault();
        setOpenLogin(true);
        setOpenRegister(false);
    };

    let showRegisterBox = (event) => {
        event.preventDefault();
        setOpenLogin(false);
        setOpenRegister(true);
    }

    return(
        <MyModal open={open} handleClose={handleClose}>

            <div className="box-controller">
                <div
                    className={"controller " + (openLogin
                        ? "selected-controller"
                        : "")}
                    onClick={showLoginBox}>
                    Login
                </div>
                <div
                    className={"controller " + (openRegister
                        ? "selected-controller"
                        : "")}
                    onClick={showRegisterBox}>
                    Register
                </div>
            </div>

            <div className="box-container">
                {openLogin && <LoginBox/>}
                {openRegister && <RegisterBox/>}
            </div>

        </MyModal>

        );
}