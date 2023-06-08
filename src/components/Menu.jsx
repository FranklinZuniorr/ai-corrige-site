import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Grid, Header, Icon, Image, Message, Modal, Popup, Segment } from "semantic-ui-react";
import store from "../store";
import suportLogoUser from "../img/suporte-user.png";
import AiCorrigeApi from "../services/AiCorrigeApi";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

const Menu = () => {

    const access = useSelector(store => store.userData);
    const cookies = Cookies.get();
    const [isOpenedAreaMenu, setIsOpenedAreaMenu] = useState(false);

    // Modal - confirm delete user
    const [isOpenModalConfirmDeleteUser, setIsOpenModalConfirmDeleteUser] = useState(false);
    // Modal - confirm delete user

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

    const deleteUser = async () => {
        const response = await AiCorrigeApi.deleteUser();

        if(!response.r){
            toast.error(response.data.msg);
        }else{
            for (const cookie in cookies) {
                Cookies.remove(cookie);
            };

            toast.success(response.data.msg)

            setTimeout(() => {
                window.location.reload();
            }, 500);

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
                        <Button color="orange" size="mini" icon="sign-out" onClick={() => {
                            logoutUser();
                        }}
                        />
                    </div>
                    <div>
                        Deletar conta
                        <Button color="red" size="mini" icon="trash alternate" onClick={() => {
                            setIsOpenModalConfirmDeleteUser(true);
                        }}
                        />
                    </div>
                </div>
            </div>

            {/* Modal */}

            <Modal
            onClose={() => setIsOpenModalConfirmDeleteUser(false)}
            onOpen={() => setIsOpenModalConfirmDeleteUser(true)}
            open={isOpenModalConfirmDeleteUser}
            >
            <Modal.Header>Atenção!</Modal.Header>
            <Modal.Content>
                <Message color="red" content="Deseja deletar sua conta de forma permanente?" />
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={() => null}>
                Não
                </Button>
                <Button color="green" onClick={() => deleteUser()}>
                Sim
                </Button>
            </Modal.Actions>
            </Modal>
        </>
    )
};

export default Menu;