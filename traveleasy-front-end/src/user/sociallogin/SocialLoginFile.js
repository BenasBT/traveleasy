import React from "react";
import fbLogo from '../../img/fb-logo.png';
import googleLogo from '../../img/google-logo.png';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL } from '../../constants';

export default function SocialLogin() {

    return(
        <div className="social-login">
            <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                <img src={googleLogo} alt="Google" /> Log in with Google</a>
            <a className="btn btn-block social-btn facebook" href={FACEBOOK_AUTH_URL}>
                <img src={fbLogo} alt="Facebook" /> Log in with Facebook</a>
        </div>
    );
}