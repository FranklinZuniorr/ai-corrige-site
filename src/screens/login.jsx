import React, { useEffect, useState } from "react";
import { Button, Form, Grid, Header, Input, Segment, Tab } from "semantic-ui-react";
import iconAi from "../img/3483127.png"
import AiCorrigeApi from "../services/AiCorrigeApi";
import { gerarObjetoCondicional } from "../utils/FnUtils";
import { toast } from "react-hot-toast";

const Login = () => {

    // Area register
    const [textUserName, setTextUserName] = useState("");
    const [textUserEmail, setTextUserEmail] = useState("");
    const [textUserPassword, setTextUserPassword] = useState("");
    const [isLoadingBtnSignUp, setIsLoadingBtnSignUp] = useState(false);
    // Area register

    useEffect(() => {
    },[]);


    const newUser = async () => {

        setIsLoadingBtnSignUp(true);

        const data = gerarObjetoCondicional({}, {textUserNameCond: textUserName, textUserEmailCond: textUserEmail, textUserPasswordCond: textUserPassword});

        const {textUserNameCond, textUserEmailCond, textUserPasswordCond} = data;

        const response = await AiCorrigeApi.newUser(textUserNameCond, textUserEmailCond, textUserPasswordCond);

        if(!response.r){
            toast.error(response.data.msg);
        }else{
            toast.success("Cadastrado com sucesso!")
        }

        console.log(response)

        setIsLoadingBtnSignUp(false);
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
                                    <Form.Field width={8}>
                                        <label>Nome de usuário:</label>
                                        <Input
                                        value={textUserName}
                                        fluid
                                        size="mini"
                                        placeholder="Termo de cadastro..."
                                        onChange={(ev, data) => setTextUserName(data.value)}
                                        />
                                    </Form.Field>
                                    <Form.Field width={8}>
                                        <label>E-mail:</label>
                                        <Input
                                        value={textUserEmail}
                                        fluid
                                        size="mini"
                                        placeholder="Termo de cadastro..."
                                        onChange={(ev, data) => setTextUserEmail(data.value)}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths={16}>
                                    <Form.Field width={16}>
                                        <label>Senha:</label>
                                        <Input
                                        value={textUserPassword}
                                        fluid
                                        size="mini"
                                        placeholder="Termo de cadastro..."
                                        onChange={(ev, data) => setTextUserPassword(data.value)}
                                        />
                                    </Form.Field>
                                </Form.Group>

                                <Button loading={isLoadingBtnSignUp} type="submit" size="mini" floated="right" color="green" content="Cadastrar" />

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
                            <Form>
                                <Form.Group widths={16}>
                                    <Form.Field width={8}>
                                        <label>E-mail:</label>
                                        <Input
                                        fluid
                                        size="mini"
                                        placeholder="Termo de cadastro..."
                                        />
                                    </Form.Field>
                                    <Form.Field width={8}>
                                        <label>Senha:</label>
                                        <Input
                                        fluid
                                        size="mini"
                                        placeholder="Termo de cadastro..."
                                        />
                                    </Form.Field>
                                </Form.Group>

                                <Button size="mini" floated="right" color="green" content="Logar" />

                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </>
        );
    };

    const panes = [
        {
          menuItem: 'Cadastro',
          render: () => <Tab.Pane attached={false}>{renderSignUp()}</Tab.Pane>,
        },
        {
          menuItem: 'Login',
          render: () => <Tab.Pane attached={false}>{renderSignIn()}</Tab.Pane>,
        },
    ];
    
    return(
        <div className="screen-login">
            <div className="area-login">
                <Header content="Ai corrige" subheader="Login ou cadastro" image={iconAi} />
                <Segment>
                    <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
                </Segment>
            </div>
        </div>
    );
};

export default Login;