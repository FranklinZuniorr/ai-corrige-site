import React, { useEffect, useState } from "react";
import { Button, Form, Grid, Header, Icon, Input, Segment, Tab } from "semantic-ui-react";
import iconAi from "../img/3483127.png"
import AiCorrigeApi from "../services/AiCorrigeApi";
import { gerarObjetoCondicional } from "../utils/FnUtils";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { KEY_COOKIE_ACCESS, KEY_COOKIE_REFRESH } from "../utils/constants";

const Login = () => {

    // Area register
    const [textUserNameSignUp, setTextUserNameSignUp] = useState("");
    const [textUserEmailSignUp, setTextUserEmailSignUp] = useState("");
    const [textUserPasswordSignUp, setTextUserPasswordSignUp] = useState("");
    const [isLoadingBtnSignUp, setIsLoadingBtnSignUp] = useState(false);
    const [activeIndexOfPane, setActiveIndexOfPane] = useState(0);
    const [showPasswordSignUp, setShowPasswordSignUp] = useState(true);
    // Area register

    // Area login
    const [textUserEmailLogin, setTextUserEmailLogin] = useState("");
    const [textUserPasswordLogin, setTextUserPasswordLogin] = useState("");
    const [isLoadingBtnLogin, setIsLoadingBtnLogin] = useState(false);
    const [showPasswordLogin, setShowPasswordLogin] = useState(true);
    // Area login

    // Area forget password
    const [textUserEmailForgetPassword, setTextUserEmailForgetPassword] = useState("");
    const [isLoadingBtnForgetPassword, setIsLoadingBtnForgetPassword] = useState(false);
    // Area forget password

    useEffect(() => {
    },[]);


    const newUser = async () => {

        setIsLoadingBtnSignUp(true);

        const data = gerarObjetoCondicional({}, {textUserNameCond: textUserNameSignUp, textUserEmailCond: textUserEmailSignUp, textUserPasswordCond: textUserPasswordSignUp});

        const {textUserNameCond, textUserEmailCond, textUserPasswordCond} = data;

        const response = await AiCorrigeApi.newUser(textUserNameCond.replaceAll(" ", "_"), textUserEmailCond, textUserPasswordCond);

        if(!response.r){
            toast.error(response.data.msg);
        }else{
            toast.success("Cadastrado com sucesso!");
            setTextUserEmailLogin(textUserEmailSignUp);
            setTextUserPasswordLogin(textUserPasswordSignUp);
            setTextUserEmailSignUp("");
            setTextUserNameSignUp("");
            setTextUserPasswordSignUp("");
            setActiveIndexOfPane(0);
        };

        console.log(response)

        setIsLoadingBtnSignUp(false);
    };

    const login = async () => {
        setIsLoadingBtnLogin(true);

        const data = gerarObjetoCondicional({}, {textUserEmailCond: textUserEmailLogin, textUserPasswordCond: textUserPasswordLogin});

        const  {textUserEmailCond, textUserPasswordCond} = data;

        const response = await AiCorrigeApi.loginUser(textUserEmailCond, textUserPasswordCond);

        if(!response.r){
            toast.error(response.data.msg);
        }else{
            toast.success("Logado com sucesso!");
            const data = response.data;
            Cookies.set(KEY_COOKIE_ACCESS, data.token);
            Cookies.set(KEY_COOKIE_REFRESH, data.refreshToken);
            setTimeout(() => {
                window.location.reload();
            }, 400);
            console.log(response)
        };

        setIsLoadingBtnLogin(false);
    };

    const forgetPassword = async () => {
        setIsLoadingBtnForgetPassword(true);
        const response = await AiCorrigeApi.forgetPassword(textUserEmailForgetPassword);

        if(!response.r){
            toast.error(response.data.msg);
        }else{
            toast.success(response.data.msg);
        };

        setIsLoadingBtnForgetPassword(false);
    };

    const renderSignUp = () => {
        return(
            <>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Header size="small" content="Cadastro:"/>
                            <Form onSubmit={() => newUser()}>
                                <Form.Group widths={16}>
                                    <Form.Field width={16}>
                                        <label>Nome de usuário:</label>
                                        <Input
                                        value={textUserNameSignUp}
                                        fluid
                                        size="mini"
                                        placeholder="Termo de cadastro..."
                                        onChange={(ev, data) => setTextUserNameSignUp(data.value)}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths={16}>
                                    <Form.Field width={16}>
                                        <label>E-mail:</label>
                                        <Input
                                        value={textUserEmailSignUp}
                                        fluid
                                        size="mini"
                                        placeholder="Termo de cadastro..."
                                        onChange={(ev, data) => setTextUserEmailSignUp(data.value)}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths={16}>
                                    <Form.Field width={16}>
                                        <label>Senha:</label>
                                        <Input
                                        type={showPasswordSignUp? "text":"password"}
                                        value={textUserPasswordSignUp}
                                        fluid
                                        size="mini"
                                        placeholder="Termo de cadastro..."
                                        onChange={(ev, data) => setTextUserPasswordSignUp(data.value)}
                                        icon={{ name: showPasswordSignUp? "eye":"eye slash", circular: true, link: true, onClick: () => setShowPasswordSignUp(!showPasswordSignUp)}}
                                        />
                                    </Form.Field>
                                </Form.Group>

                                <Button className="margin-top-min" loading={isLoadingBtnSignUp} type="submit" size="mini" floated="right" color="green" content="Cadastrar" />

                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </>
        );
    };

    const renderSignIn = () => {
        return(
            <>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Header size="small" content="Login:"/>
                            <Form onSubmit={() => login()}>
                                <Form.Group widths={16}>
                                    <Form.Field width={16}>
                                        <label>E-mail:</label>
                                        <Input
                                        value={textUserEmailLogin}
                                        fluid
                                        size="mini"
                                        placeholder="Termo de login..."
                                        onChange={(ev, data) => setTextUserEmailLogin(data.value)}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths={16}>
                                    <Form.Field width={16}>
                                        <label>Senha:</label>
                                        <Input
                                        type={showPasswordLogin? "text":"password"}
                                        value={textUserPasswordLogin}
                                        fluid
                                        size="mini"
                                        placeholder="Termo de login..."
                                        onChange={(ev, data) => setTextUserPasswordLogin(data.value)}
                                        icon={{ name: showPasswordLogin? "eye":"eye slash", circular: true, link: true, onClick: () => setShowPasswordLogin(!showPasswordLogin)}}
                                        />
                                    </Form.Field>
                                </Form.Group>

                                <Button className="margin-top-min" type="submit" loading={isLoadingBtnLogin} size="mini" floated="right" color="green" content="Logar" />

                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </>
        );
    };

    const renderForgetPassword = () => {
        return(
            <>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Header size="small" content="Restaurar senha:"/>
                            <Form onSubmit={() => forgetPassword()}>
                                <Form.Group widths={16}>
                                    <Form.Field width={16}>
                                        <label>E-mail:</label>
                                        <Input
                                        value={textUserEmailForgetPassword}
                                        fluid
                                        size="mini"
                                        placeholder="Termo de busca..."
                                        onChange={(ev, data) => setTextUserEmailForgetPassword(data.value)}
                                        />
                                    </Form.Field>
                                </Form.Group>

                                <Button className="margin-top-min" type="submit" loading={isLoadingBtnForgetPassword} size="mini" floated="right" color="green" content="Enviar e-mail de restauração" />

                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </>
        );
    };

    const panes = [
        {
          menuItem: 'Login',
          render: () => <Tab.Pane attached={false}>{renderSignIn()}</Tab.Pane>,
        },
        {
          menuItem: 'Cadastro',
          render: () => <Tab.Pane attached={false}>{renderSignUp()}</Tab.Pane>,
        },
        {
          menuItem: 'Restaurar senha',
          render: () => <Tab.Pane attached={false}>{renderForgetPassword()}</Tab.Pane>,
        },
    ];
    
    return(
        <div className="screen-login">
            <div className="area-login">
                <Header content="Ai corrige" subheader="Login ou cadastro" image={iconAi} />
                <Segment>
                    <Tab onTabChange={(ev, data) => setActiveIndexOfPane(data.activeIndex)} activeIndex={activeIndexOfPane} menu={{ secondary: true, pointing: true }} panes={panes} />
                </Segment>
            </div>
        </div>
    );
};

export default Login;