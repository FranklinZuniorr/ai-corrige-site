import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Dropdown, Form, Grid, Header, Icon, Image, Input, Label, Message, Popup, Progress, Segment, Step } from "semantic-ui-react";
import store from "../store";
import suportLogoUser from "../img/suporte-user.png";
import { KEY_COOKIE_ACCESS, OPTIONS_DIFFICULTY, OPTIONS_INPUT_THEME } from "../utils/constants";
import { filterDifficulty } from "../utils/FnUtils";
import AiCorrigeApi from "../services/AiCorrigeApi";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

const Home = () => {

    // Global
    const [currentUserData, setCurrentUserData] = useState(null);
    // Global

    // Search area
    const [textSubject, setTextSubject] = useState("");
    // Search area

    useEffect(() => {
        getPropsOfUser();
    }, []);

    const getPropsOfUser = async () => {
        const accessToken = Cookies.get(KEY_COOKIE_ACCESS);
        const response = await AiCorrigeApi.verifyAccessToken(accessToken);

        if(!response.r){
            toast.error(response.data.msg);
            return
        };

        const data = response.data.user;

        setCurrentUserData(data);
    };

    return(
        <>
            <div className="display-home">
                <Header content="Gerar atividade" />
                <Segment>
                    <Grid>
                        <Grid.Row textAlign="left">
                            <Grid.Column>
                                <Form className="area-form-home-search">
                                    <Form.Group>
                                        <Form.Field width={16}>
                                            <label>Assunto:</label>
                                            <Dropdown
                                            placeholder="Escolha um assunto!"
                                            selection
                                            clearable
                                            options={OPTIONS_INPUT_THEME}
                                            onChange={(ev, data) => {
                                                getPropsOfUser();
                                                setTextSubject(ev.target.innerText.replaceAll(" ", "_").toLowerCase())
                                            }}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    {
                                        (textSubject != "" && currentUserData != null) &&
                                        <>
                                            <Form.Group>
                                                <Form.Field>
                                                    <Label.Group>
                                                        <Label content={
                                                            <>
                                                                <Header size="tiny" content="0 pontos" subheader="Nível fácil" />
                                                            </>
                                                        } color={
                                                            (currentUserData.queries[textSubject] != undefined? 
                                                            currentUserData.queries[textSubject]["totalNote"]:0) < 100? "green":null
                                                        }/>
                                                        <Label content={
                                                            <>
                                                                <Header size="tiny" content="100 pontos" subheader="Nível médio" />
                                                            </>
                                                        } color={
                                                            (currentUserData.queries[textSubject] != undefined? 
                                                            currentUserData.queries[textSubject]["totalNote"]:0) >= 100 && 
                                                            (currentUserData.queries[textSubject] != undefined? 
                                                            currentUserData.queries[textSubject]["totalNote"]:0) < 200? "green":null
                                                        } />
                                                        <Label content={
                                                            <>
                                                                <Header size="tiny" content="200 pontos" subheader="Nível difícil" />
                                                            </>
                                                        } color={
                                                            (currentUserData.queries[textSubject] != undefined? 
                                                            currentUserData.queries[textSubject]["totalNote"]:0) >= 200? "green":null
                                                        } />
                                                    </Label.Group>
                                                </Form.Field>
                                                <Form.Field>
                                                    <Message size="mini" content={`Sua pontuação: ${currentUserData.queries[textSubject] != undefined? 
                                                    currentUserData.queries[textSubject]["totalNote"]:0}`} />
                                                </Form.Field>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Field>
                                                    <label>Dificuldade:</label>
                                                    <Dropdown 
                                                    placeholder="Escolha um nível!"
                                                    selection
                                                    options={filterDifficulty(
                                                        currentUserData.queries[textSubject] != undefined? 
                                                        currentUserData.queries[textSubject]["totalNote"]:0
                                                    )}
                                                    />
                                                </Form.Field>
                                            </Form.Group>
                                            <Button color="blue" floated="right" content="🤖 Gerar atividade" />
                                        </>
                                    }

                                </Form>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        </>
    );
};

export default Home;