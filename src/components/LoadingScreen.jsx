import React from "react";
import { Dimmer, Image, Loader } from "semantic-ui-react";
import logo from '../img/logo.png';

const LoadingScreen = () => {
    return(
        <>
            <Dimmer active>
                <div className="loading-ai-screen">
                    <Image size="small" src={logo} />
                </div>
            </Dimmer>
        </>
    );
};

export default LoadingScreen;