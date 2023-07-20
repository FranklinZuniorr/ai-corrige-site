import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Grid, Header, Icon, Image, Input, Message, Modal, Popup, Segment } from "semantic-ui-react";
import store from "../store";
import suportLogoUser from "../img/suporte-user.png";
import AiCorrigeApi from "../services/AiCorrigeApi";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { gerarObjetoCondicional, getParamsInQs, verifyName, verifyPassword } from "../utils/FnUtils";
import { verifyUser } from "../utils/Options";
import Stripe from "./Stripe/Stripe";
import logo from '../img/logo.png';

const Menu = () => {

    const access = useSelector(store => store.userData);
    const cookies = Cookies.get();
    const [isOpenedAreaMenu, setIsOpenedAreaMenu] = useState(null);
    const [sizeWidthScreen, setSizeWidthScreen] = useState(0);

    // Modal - confirm delete user
    const [isOpenModalConfirmDeleteUser, setIsOpenModalConfirmDeleteUser] = useState(false);
    // Modal - confirm delete user

    // Modal - edit user
    const [isOpenModalEditUser, setIsOpenModalEditUser] = useState(false);
    const [textDropboxCode, setTextDropboxCode] = useState("");
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

    // Modal - buy tickets
    const [isOpenModalBuyTickets, setIsOpenModalBuyTickets] = useState(false);
    // Modal - buy tickets

    useEffect(() => {
        /* console.log(access) */

        getSizeScreen();

        const execute = async () => {
            const data = getParamsInQs()

            if(data.r){
                const filter = data.data;
                const { code } = filter;

                if("code" in filter){
                    setTextDropboxCode(code);
                    setIsOpenModalEditUser(true);
                    /* console.log(window.location.pathname) */
                    window.history.pushState({}, '', window.location.pathname);
                };
            }
        };

        execute();
    }, []);

    const getSizeScreen = () => {
        var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      
        setSizeWidthScreen(width);
    };

    window.addEventListener('resize', getSizeScreen);

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

    const uploadImage = async () => {
        setIsLoadingBtnEditImage(true);
        const response = await AiCorrigeApi.uploadImage(imageFileEdit, textDropboxCode);

        if(!response.r){
            toast.error(response.data.msg);
        }else{
            toast.success(response.data.msg);
            const data = response.data;
            if(response.data.msg == "O login no dropBox é necessário!"){
                window.location.href = data.url;
            }else{
                verifyUser();
                setTextDropboxCode("");
                setIsOpenModalEditUser(false);
            };
        };

        setIsLoadingBtnEditImage(false);
    };

    const editUser = async () => {
        setIsLoadingBtnEdit(true);

        const data = gerarObjetoCondicional({}, {
            textUserNameEditCond: textUserNameEdit.replaceAll(" ", "_"), 
            textUserEmailEditCond: textUserEmailEdit, 
            textUserPasswordEditCond: textUserPasswordEdit
        });
        /* console.log(data) */

        const {textUserNameEditCond, textUserEmailEditCond, textUserPasswordEditCond} = data;

        const response = await AiCorrigeApi.editUser(textUserNameEditCond, textUserEmailEditCond, textUserPasswordEditCond);

        if(!response.r){
            toast.error(response.data.msg);
        }else{
            toast.success(response.data.msg);
            verifyUser();
            setTextDropboxCode("");
            setIsOpenModalEditUser(false);
            setTextUserEmailEdit("");
            setTextUserNameEdit("");
            setTextUserPasswordEdit("");
        };

        setIsLoadingBtnEdit(false);
    };

    return(
        <>
            <div id="menu-background" onClick={() => setIsOpenedAreaMenu(false)} className={isOpenedAreaMenu !== null? isOpenedAreaMenu? "is-open-menu":"not-is-open-menu":""}/>
            <div id="top-menu" className={isOpenedAreaMenu? "is-open-menu":"not-is-open-menu"}>
                <Header 
                size="small"
                as="h3" 
                floated="left" 
                className="margin-top-mini" 
                textAlign="left" 
                image={
                    <Image className="image-profile-bar-top" src={access.img || suportLogoUser} avatar bordered />
                } 
                content={access.username} 
                subheader={`Tickets: ${access.coins}`} 
                />
                <div className="area-action-btns">
                    <Button size="mini" color="black" floated="right" icon={isOpenedAreaMenu? "x":"bars"}  onClick={() => {
                        setIsOpenedAreaMenu(!isOpenedAreaMenu);
                    }} 
                    />
                    <Button size="mini" color="green" floated="right" icon="dollar sign" content={
                        sizeWidthScreen <= 450? null:"COMPRAR +10 TICKETS"
                    } onClick={() => {
                        setIsOpenModalBuyTickets(true);
                    }} 
                    />
                </div>
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
                                                style={{fontSize: "10px"}}
                                                size="mini"
                                                type="file"
                                                disabled={textDropboxCode == ""}
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
                                        size="mini"
                                        loading={isLoadingBtnEditImage}
                                        disabled={isLoadingBtnEditImage}
                                        type="submit" 
                                        className="margin-top-mini" 
                                        content={textDropboxCode == ""? "Permitir envio de imagem ao DropBox":"Enviar arquivo"} 
                                        icon="dropbox"
                                        color="blue" 
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
                                <Form onSubmit={() => editUser()}>
                                    <Form.Group widths={16}>
                                        <Form.Field width={16}>
                                            <label>Nome de usuário:</label>
                                            <Popup inverted size="mini" on="click" content={
                                            <>
                                                <div>
                                                    <Icon className="info" />
                                                    Caracteres: {textUserNameEdit.length}
                                                </div>
                                                <div>
                                                    {verifyName(textUserNameEdit)? <Icon color="green" className="check" />:<Icon color="red" className="x" />}
                                                    Quantidade maior ou igual a 15 e menor ou igual a 20.
                                                </div>
                                            </>
                                            } trigger={
                                                <Input
                                                value={textUserNameEdit}
                                                fluid
                                                size="mini"
                                                placeholder="Nome..."
                                                onChange={(ev, data) => setTextUserNameEdit(data.value)}
                                                />
                                            } />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group widths={16}>
                                        <Form.Field width={16}>
                                            <label>E-mail:</label>
                                            <Input
                                            value={textUserEmailEdit}
                                            fluid
                                            size="mini"
                                            placeholder="E-mail..."
                                            onChange={(ev, data) => setTextUserEmailEdit(data.value)}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group widths={16}>
                                        <Form.Field width={16}>
                                            <label>Senha:</label>
                                            <Popup inverted size="mini" on="click" content={
                                                <>
                                                    <div>
                                                        <Icon className="info" />
                                                        Caracteres: {textUserPasswordEdit.length}
                                                    </div>
                                                    <div>
                                                        {verifyPassword(textUserPasswordEdit).capitalLetter? <Icon color="green" className="check" />:<Icon color="red" className="x" />}
                                                        Letra maiúscula
                                                    </div>
                                                    <div>
                                                        {verifyPassword(textUserPasswordEdit).lowerCase? <Icon color="green" className="check" />:<Icon color="red" className="x" />}
                                                        Letra minúscula
                                                    </div>
                                                    <div>
                                                        {verifyPassword(textUserPasswordEdit).oneNumber? <Icon color="green" className="check" />:<Icon color="red" className="x" />}
                                                        Número
                                                    </div>
                                                    <div>
                                                        {verifyPassword(textUserPasswordEdit).specialCharacter? <Icon color="green" className="check" />:<Icon color="red" className="x" />}
                                                        Caractere especial
                                                    </div>
                                                    <div>
                                                        {verifyPassword(textUserPasswordEdit).eightCharacters? <Icon color="green" className="check" />:<Icon color="red" className="x" />}
                                                        Quantidade maior ou igual a 8
                                                    </div>
                                                </>
                                            } trigger={
                                                <Input
                                                type={showPasswordEdit? "text":"password"}
                                                value={textUserPasswordEdit}
                                                fluid
                                                size="mini"
                                                placeholder="Senha..."
                                                onChange={(ev, data) => setTextUserPasswordEdit(data.value)}
                                                icon={{ name: showPasswordEdit? "eye":"eye slash", circular: true, link: true, 
                                                onClick: () => setShowPasswordEdit(!showPasswordEdit)}}
                                                />
                                            } />
                                        </Form.Field>
                                    </Form.Group>

                                    <Button 
                                    loading={isLoadingBtnEdit}
                                    type="submit" 
                                    className="margin-top-mini" 
                                    floated="right" 
                                    content="Salvar alterações" 
                                    color="green" 
                                    size="mini"
                                    />
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

            {/*  Modal - buy tickets */}
            <Modal
            onClose={() => setIsOpenModalBuyTickets(false)}
            onOpen={() => setIsOpenModalBuyTickets(true)}
            open={isOpenModalBuyTickets}
            >
            <Modal.Header>Tickets de acesso</Modal.Header>
            <Modal.Content>
                <Stripe/>
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={() => setIsOpenModalBuyTickets(false)}>
                Fechar
                </Button>
            </Modal.Actions>
            </Modal>
            {/*  Modal - buy tickets */}
        </>
    )
};

export default Menu;