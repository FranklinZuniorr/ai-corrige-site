import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const LoadingScreen = () => {
    return(
        <>
            <Dimmer active>
                <Loader />
            </Dimmer>
        </>
    );
};

export default LoadingScreen;