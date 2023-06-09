import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Grid, Header, Icon, Image, Input, Message, Modal, Popup, Segment } from "semantic-ui-react";
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

    // Modal - edit user
    const [isOpenModalEditUser, setIsOpenModalEditUser] = useState(false);
    // Area - edit
    const [textUserNameEdit, setTextUserNameEdit] = useState("");
    const [textUserEmailEdit, setTextUserEmailEdit] = useState("");
    const [textUserPasswordEdit, setTextUserPasswordEdit] = useState("");
    const [isLoadingBtnEdit, setIsLoadingBtnEdit] = useState(false);
    const [showPasswordEdit, setShowPasswordEdit] = useState(true);
    const [imageFileEdit, setImageFileEdit] = useState(null);
    const [imageFileEditSelected, setImageFileEditSelected] = useState(null);
    const [isLoadingBtnEditImage, setIsLoadingBtnEditImage] = useState(false);
    // Area - edit
    // Modal - edit user

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

    const uploadImage = async (code = "") => {
        setIsLoadingBtnEditImage(true);
        const response = await AiCorrigeApi.uploadImage(imageFileEdit, code);

        if(!response.r){
            toast.error(response.data.msg);
        }else{
            toast.success(response.data.msg);
            const data = response.data;
            const opcoes = `width=500,height=800,top=100,left=100,resizable=yes,scrollbars=yes`;
            window.open(data.url, "_blank", opcoes);
            console.log(response)
        };

        setIsLoadingBtnEditImage(false);
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
                        Editar usuário
                        <Button color="blue" size="mini" icon="edit" onClick={() => {
                            setIsOpenModalEditUser(true);
                        }}
                        />
                    </div>
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

            {/* Modal - confirm delete user */}
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
                <Button color="red" onClick={() => setIsOpenModalConfirmDeleteUser(false)}>
                Não
                </Button>
                <Button color="green" onClick={() => deleteUser()}>
                Sim
                </Button>
            </Modal.Actions>
            </Modal>
            {/* Modal - confirm delete user */}

            {/* Modal - edit user */}
            <Modal
            onClose={() => setIsOpenModalEditUser(false)}
            onOpen={() => setIsOpenModalEditUser(true)}
            open={isOpenModalEditUser}
            >
            <Modal.Header>Editar usuário</Modal.Header>
            <Modal.Content>
                <Segment>
                    <Header size="medium" content="Foto de perfil:" />
                    <Segment>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column>
                                    <Form onSubmit={() => uploadImage()}>
                                        <Form.Group>
                                            <Form.Field>
                                                <Image 
                                                size="tiny" 
                                                bordered src={imageFileEditSelected || suportLogoUser} 
                                                className="image-selected-feedback-edit"
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <label>Arquivo:</label>
                                                <Input
                                                type="file"
                                                onChange={(ev, data) => {

                                                    const file = ev.target.files[0];
                                                    const reader = new FileReader();
                                                    setImageFileEdit(file);

                                                    reader.onload = () => {
                                                    setImageFileEditSelected(reader.result);
                                                    };

                                                    file && reader.readAsDataURL(file);
                                                }}
                                                />
                                            </Form.Field>
                                        </Form.Group>

                                        <Button 
                                        loading={isLoadingBtnEditImage}
                                        type="submit" 
                                        className="margin-top-mini" 
                                        content="Enviar arquivo" 
                                        color="green" 
                                        floated="right" 
                                        />
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Segment>
                <Segment>
                    <Header size="medium" content="Informações:" />
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <Form>
                                    <Form.Group widths={16}>
                                        <Form.Field width={16}>
                                            <label>Nome de usuário:</label>
                                            <Input
                                            value={textUserNameEdit}
                                            fluid
                                            size="mini"
                                            placeholder="Termo de edição..."
                                            onChange={(ev, data) => setTextUserNameEdit(data.value)}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group widths={16}>
                                        <Form.Field width={16}>
                                            <label>E-mail:</label>
                                            <Input
                                            value={textUserEmailEdit}
                                            fluid
                                            size="mini"
                                            placeholder="Termo de edição..."
                                            onChange={(ev, data) => setTextUserEmailEdit(data.value)}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group widths={16}>
                                        <Form.Field width={16}>
                                            <label>Senha:</label>
                                            <Input
                                            type={showPasswordEdit? "text":"password"}
                                            value={textUserPasswordEdit}
                                            fluid
                                            size="mini"
                                            placeholder="Termo de edição..."
                                            onChange={(ev, data) => setTextUserPasswordEdit(data.value)}
                                            icon={{ name: showPasswordEdit? "eye":"eye slash", circular: true, link: true, 
                                            onClick: () => setShowPasswordEdit(!showPasswordEdit)}}
                                            />
                                        </Form.Field>
                                    </Form.Group>

                                    <Button className="margin-top-mini" floated="right" content="Salvar alterações" color="green" />
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={() => setIsOpenModalEditUser(false)}>
                Fechar
                </Button>
            </Modal.Actions>
            </Modal>
            {/* Modal - edit user */}
        </>
    )
};

export default Menu;