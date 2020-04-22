import React from "react";
import fbLogo from '../../img/fb-logo.png';
import googleLogo from '../../img/google-logo.png';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL } from '../../constants';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    social_btn_img: {
        height: 32,
        margin_top: 10,
    },
    social_btn:{
        margin_bottom: 15,
        font_weight: 400,
        font_size: 16
    },
}));

export default function SocialLogin() {
    const classes = useStyles();
    return(
        <div >
            <p>Or login with other accounts:</p>
            <a className={classes.social_btn}  href={GOOGLE_AUTH_URL}>
                <img className={classes.social_btn_img}  src={googleLogo} alt="Google" /> Log in with Google</a>
            <br/>
            <a className={classes.social_btn}  href={FACEBOOK_AUTH_URL}>
                <img className={classes.social_btn_img}  src={fbLogo} alt="Facebook" /> Log in with Facebook</a>
        </div>
    );
}