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

    const resAiCurrent = useSelector(store => store.resAiCurrent);

    // Global
    const [currentUserData, setCurrentUserData] = useState(null);
    // Global

    // Search area
    const [textSubject, setTextSubject] = useState("");
    const [textDifficulty, setTextDifficulty] = useState("Fácil");
    const [isLoadingGenerateActivity, setIsLoadingGenerateActivity] = useState(false);
    // Search area

    useEffect(() => {
        getPropsOfUser();
    }, []);

    useEffect(() => {
        console.log(resAiCurrent);
        if(resAiCurrent != null && !resAiCurrent.r){
            toast.error(resAiCurrent.msg);
        };

        setIsLoadingGenerateActivity(false);
    }, [resAiCurrent]);

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

    const aiJsonAmqp = async () => {

        setTextSubject("");
        setIsLoadingGenerateActivity(true);

        const data = {
            title: OPTIONS_INPUT_THEME.find(input => input.value == textSubject).text.replaceAll(" ", "_").toLowerCase(),
            msg: textSubject,
            difficulty: textDifficulty
        };

        const response = await AiCorrigeApi.aiJsonAmqp(data.title, data.msg, data.difficulty);

        if(!response.r){
            toast.error(response.data.msg.join("\n"));
        };

        toast.success(response.data.msg);
    };

    return(
        <>
            <div className="display-home">
                <Segment>
                    <Header textAlign="left" content="Gerar atividade" />
                    <Grid>
                        <Grid.Row textAlign="left">
                            <Grid.Column>
                                <Form className="area-form-home-search" onSubmit={() => aiJsonAmqp()}>
                                    <Form.Group>
                                        <Form.Field width={16}>
                                            <label>Assunto:</label>
                                            <Dropdown
                                            placeholder="Escolha um assunto!"
                                            disabled={isLoadingGenerateActivity}
                                            selection
                                            clearable
                                            value={textSubject}
                                            options={OPTIONS_INPUT_THEME}
                                            onChange={(ev, data) => {
                                                getPropsOfUser();
                                                setTextSubject(data.value);
                                                /* console.log(ev.target.innerText) */
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
                                                    value={textDifficulty}
                                                    placeholder="Escolha um nível!"
                                                    selection
                                                    clearable
                                                    options={filterDifficulty(
                                                        currentUserData.queries[textSubject] != undefined? 
                                                        currentUserData.queries[textSubject]["totalNote"]:0
                                                    )}
                                                    onChange={(ev, data) => setTextDifficulty(data.value)}
                                                    />
                                                </Form.Field>
                                            </Form.Group>
                                            <Button type="submit" disabled={textDifficulty == ""} color="blue" floated="right" content="🤖 Gerar atividade" />
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