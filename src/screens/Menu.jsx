import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Grid, Header, Icon, Image, Popup, Segment } from "semantic-ui-react";
import store from "../store";
import suportLogoUser from "../img/suporte-user.png";
import AiCorrigeApi from "../services/AiCorrigeApi";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

const Menu = () => {

    const access = useSelector(store => store.userData);
    const [isOpenedAreaMenu, setIsOpenedAreaMenu] = useState(false);
    const cookies = Cookies.get();

    useEffect(() => {
        console.log(access)
    }, []);

    const logoutUser = async () => {
        const response = await AiCorrigeApi.logoutUser();

        if(!response.r){
            toast.error(response.data.msg);
        }else{
            for (const cookie in cookies) {
                Cookies.remove(cookie);
            };

            window.location.reload();
        };
    };

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
                <Popup inverted content="Opções" trigger={
                    <Button color="black" floated="right" icon={isOpenedAreaMenu? "x":"bars"}  onClick={() => {
                        setIsOpenedAreaMenu(!isOpenedAreaMenu);
                    }} 
                    />
                } />
                <div id="area-menu" className={isOpenedAreaMenu? "opened":"closed"}>
                    <div>
                        Sair da conta
                        <Button color="red" size="mini" icon="sign-out" onClick={() => {
                            logoutUser();
                        }}
                        />
                    </div>
                </div>
            </div>
        </>
    )
};

export default Menu;