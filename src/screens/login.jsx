import React, { useEffect, useState } from "react";
import { Button, Divider, Form, Grid, Header, Icon, Image, Input, List, Message, Modal, Popup, Segment, Tab } from "semantic-ui-react";
import iconAi from "../img/3483127.png"
import AiCorrigeApi from "../services/AiCorrigeApi";
import { gerarObjetoCondicional, verifyName, verifyPassword } from "../utils/FnUtils";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { KEY_COOKIE_ACCESS, KEY_COOKIE_REFRESH } from "../utils/constants";
import logo from '../img/logo.png';
import blackLogo from '../img/blackLogo.png';
import ai from '../img/ai.png';
import PrivacyPolicy from "../components/PrivacyPolicy";
import moment from "moment";

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

    //Modal privacy policy
    const [isOpenModalPrivacyPolicy, setIsOpenModalPrivacyPolicy] = useState(false);
    //Modal privacy policy

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
                                        <Popup inverted size="mini" on="click" content={
                                            <>
                                                <div>
                                                    <Icon className="info" />
                                                    Caracteres: {textUserNameSignUp.length}
                                                </div>
                                                <div>
                                                    {verifyName(textUserNameSignUp)? <Icon color="green" className="check" />:<Icon color="red" className="x" />}
                                                    Quantidade maior ou igual a 15 e menor ou igual a 20.
                                                </div>
                                            </>
                                        } trigger={
                                            <Input
                                            value={textUserNameSignUp}
                                            fluid
                                            size="mini"
                                            placeholder="Termo de cadastro..."
                                            onChange={(ev, data) => setTextUserNameSignUp(data.value)}
                                            />
                                        } />
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
                                        <Popup inverted size="mini" on="click" content={
                                            <>
                                                <div>
                                                    <Icon className="info" />
                                                    Caracteres: {textUserPasswordSignUp.length}
                                                </div>
                                                <div>
                                                    {verifyPassword(textUserPasswordSignUp).capitalLetter? <Icon color="green" className="check" />:<Icon color="red" className="x" />}
                                                    Letra maiúscula
                                                </div>
                                                <div>
                                                    {verifyPassword(textUserPasswordSignUp).lowerCase? <Icon color="green" className="check" />:<Icon color="red" className="x" />}
                                                    Letra minúscula
                                                </div>
                                                <div>
                                                    {verifyPassword(textUserPasswordSignUp).oneNumber? <Icon color="green" className="check" />:<Icon color="red" className="x" />}
                                                    Número
                                                </div>
                                                <div>
                                                    {verifyPassword(textUserPasswordSignUp).specialCharacter? <Icon color="green" className="check" />:<Icon color="red" className="x" />}
                                                    Caractere especial
                                                </div>
                                                <div>
                                                    {verifyPassword(textUserPasswordSignUp).eightCharacters? <Icon color="green" className="check" />:<Icon color="red" className="x" />}
                                                    Quantidade maior ou igual a 8
                                                </div>
                                            </>
                                        } trigger={
                                            <Input
                                            type={showPasswordSignUp? "text":"password"}
                                            value={textUserPasswordSignUp}
                                            fluid
                                            size="mini"
                                            placeholder="Termo de cadastro..."
                                            onChange={(ev, data) => setTextUserPasswordSignUp(data.value)}
                                            icon={{ name: showPasswordSignUp? "eye":"eye slash", circular: true, link: true, onClick: () => setShowPasswordSignUp(!showPasswordSignUp)}}
                                            />
                                        } />
                                    </Form.Field>
                                </Form.Group>

                                <Message size="mini" content="Ao fazer o cadastro você concorda com o uso de cookies." />
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
        <>
            <div className="display-screen-login">
            <div className="screen-login">
                <header className="area-1">
                        <div className="area-login">
                            <Header content="Ai corrige" subheader="Login ou cadastro" image={logo} />
                            <Segment>
                                <Tab onTabChange={(ev, data) => setActiveIndexOfPane(data.activeIndex)} activeIndex={activeIndexOfPane} menu={{ secondary: true, pointing: true }} panes={panes} />
                            </Segment>
                        </div>
                </header>
                <section className="area-2">

                    <div className="area-2-info">
                        <Segment>
                            <Header content="Ai corrige" subheader="Plataforma de aprendizado virtual com o uso de inteligência artificial." />
                        </Segment>

                        <Divider />

                        <Header content="Alguns dos objetivos:" />

                        <List>
                            <List.Item>
                            <List.Icon name='check' />
                            <List.Content>Absorver conteúdos de forma rápida.</List.Content>
                            </List.Item>
                            <List.Item>
                            <List.Icon name='check' />
                            <List.Content>Gerar feedback com gráficos sobre a evolução do usuário ao decorrer do tempo.</List.Content>
                            </List.Item>
                            <List.Item>
                            <List.Icon name='check' />
                            <List.Content>Motivar a evolução com um sistema de níveis.</List.Content>
                            </List.Item>
                            <List.Item>
                            <List.Icon name='check' />
                            <List.Content>Desenvolver competitividade saudável por meio de ranking de pontos entre os usuários.</List.Content>
                            </List.Item>
                            <List.Item>
                            <List.Icon name='check' />
                            <List.Content>Aprimorar a confiança e a capacidade de adaptação ao responder atividades completamente surpreendentes geradas pela inteligência artificial de acordo com o assunto escolhido.</List.Content>
                            </List.Item>
                            <List.Item>
                            <List.Icon name='check' />
                            <List.Content>Incitar à curiosidade por meio dos aspectos da aleatoriedade e surpreendimento ao gerar uma atividade.</List.Content>
                            </List.Item>
                            <List.Item>
                            <List.Icon name='check' />
                            <List.Content>Promover os sentimentos de recompensa e motivação a cada atividade gerada e respondida.</List.Content>
                            </List.Item>
                        </List>

                        <Header content="Foco:" />

                        <List>
                            <List.Item>
                            <List.Icon name='address book' />
                            <List.Content>Estudantes do Enem.</List.Content>
                            </List.Item>
                        </List>

                        <Divider />

                        <Header content="Curtiu? Que tal fazer o seu cadastro!?" subheader="É fácil, só vai precisar do seu melhor e-mail, nome de usuário e uma senha. Simples, não?" />
                    </div>

                    <div className="area-2-footer">

                        <Header image={logo} content="Ai corrige" subheader="Relaxe, aprenda comigo (:" />
                        <Message size="mini" content={
                            <Button size="mini" color="blue" content="Política de privacidade" onClick={() => setIsOpenModalPrivacyPolicy(true)} />
                        } />

                    </div>
                
                </section>
                <div/>

                {/* Modal - privacy policy */}
                <Modal
                onClose={() => setIsOpenModalPrivacyPolicy(false)}
                onOpen={() => setIsOpenModalPrivacyPolicy(true)}
                open={isOpenModalPrivacyPolicy}
                >
                <Modal.Header>Política de privacidade</Modal.Header>
                <Modal.Content>
                    <Segment>
                        <PrivacyPolicy />
                    </Segment>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' onClick={() => setIsOpenModalPrivacyPolicy(false)}>
                        Fechar
                    </Button>
                </Modal.Actions>
                </Modal>
                {/* Modal - privacy policy */}
            </div>

            <footer>
                <Grid celled stackable>
                    <Grid.Row columns={3} verticalAlign="middle" textAlign="left">
                        <Grid.Column>
                            <Header size="tiny" image={blackLogo} content="Ai corrige" subheader="Desenvolvido por Franklin Vieira Barbosa." />
                        </Grid.Column>
                        <Grid.Column>
                            <Header size="tiny" icon="mail" content="E-mail para contato:" subheader={
                            <div><a href="mailto:aicorrige763@gmail.com?subject=Uma dúvida...&body=Olá!" >aicorrige763@gmail.com</a></div>
                            } />
                        </Grid.Column>
                        <Grid.Column>
                            <Header size="tiny" icon="copyright outline" content="Todos os direitos reservados:" subheader={`${moment().year()}, Franklin V. Barbosa.`} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </footer>

            </div>
        </>
    );
};

export default Login;