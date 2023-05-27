import React, { useEffect } from "react";
import { Button, Form, Grid, Header, Input, Segment, Tab } from "semantic-ui-react";
import iconAi from "../img/3483127.png"
import AiCorrigeApi from "../services/AiCorrigeApi";

const Login = () => {

    useEffect(() => {
        newUser()
    },[]);


    const newUser = async () => {
        const response = await AiCorrigeApi.newUser("tegdggd", "tegdggd@gmail.com", "As12@#$r");

        console.log(response)
    };

    const renderSignUp = () => {
        return(
            <>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Header size="small" content="Cadastro:"/>
                            <Form>
                                <Form.Group widths={16}>
                                    <Form.Field width={8}>
                                        <label>Nome de usuário:</label>
                                        <Input
                                        fluid
                                        size="mini"
                                        placeholder="Termo de cadastro..."
                                        />
                                    </Form.Field>
                                    <Form.Field width={8}>
                                        <label>E-mail:</label>
                                        <Input
                                        fluid
                                        size="mini"
                                        placeholder="Termo de cadastro..."
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths={16}>
                                    <Form.Field width={16}>
                                        <label>Senha:</label>
                                        <Input
                                        fluid
                                        size="mini"
                                        placeholder="Termo de cadastro..."
                                        />
                                    </Form.Field>
                                </Form.Group>

                                <Button size="mini" floated="right" color="green" content="Cadastrar" />

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