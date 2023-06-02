import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Grid, Image, Segment } from "semantic-ui-react";
import store from "../store";
import suportLogoUser from "../img/suporte-user.png";

const Home = () => {

    const access = useSelector(store => store.userData);

    useEffect(() => {
        console.log(access)
    }, []);

    return(
        <>
            <div className="top-menu">
                <Image size="mini" avatar src={access.img || suportLogoUser} />
                <Button floated="right" icon="sign-out"  />
            </div>
        </>
    );
};

export default Home;