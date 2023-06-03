import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Grid, Header, Icon, Image, Segment } from "semantic-ui-react";
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
                <Header 
                as="h3" 
                floated="left" 
                className="margin-top-mini" 
                textAlign="left" 
                image={access.img || suportLogoUser} 
                content={access.username} 
                subheader={`Coins: ${access.coins}`} 
                />
                <Button color="black" floated="right" icon="sign-out"  />
            </div>
        </>
    );
};

export default Home;