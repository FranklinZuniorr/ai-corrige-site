import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, Form, Grid, Header, Icon, Image, Input, Label, Loader, Message, Modal, Popup, Progress, Segment, Step } from "semantic-ui-react";
import store, { setResAiCurrent, setUserData } from "../store";
import suportLogoUser from "../img/suporte-user.png";
import { KEY_COOKIE_ACCESS, OPTIONS_DIFFICULTY, OPTIONS_INPUT_THEME } from "../utils/constants";
import { filterDifficulty, filterDifficultyColor } from "../utils/FnUtils";
import AiCorrigeApi from "../services/AiCorrigeApi";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import AiLoading from "../components/AiLoading";
import CreateActivity from "../components/CreateActivity";
import moment from "moment";

const Home = () => {

    const resAiCurrent = useSelector(store => store.resAiCurrent);
    const dispatch = useDispatch();

    // Global
    const [currentUserData, setCurrentUserData] = useState(null);
    const [currentActivity, setCurrentActivity] = useState(null);
    const [difficultyColor, setDifficultyColor] = useState(0);
    // Global

    // Search area
    const [textSubject, setTextSubject] = useState("");
    const [textSubjectTitle, setTextSubjectTitle] = useState("");
    const [textDifficulty, setTextDifficulty] = useState("Fácil");
    const [isLoadingGenerateActivity, setIsLoadingGenerateActivity] = useState(false);
    // Search area

    // Modal activities pending
    const [isOpenModalActivitiesPending, setIsOpenModalActivitiesPending] = useState(false);
    const [dataModalActivitiesPending, setDataModalActivitiesPending] = useState(null);
    // Modal activities pending

    useEffect(() => {
        getPropsOfUser();
    }, []);

    useEffect(() => {
        console.log(resAiCurrent);
        setIsLoadingGenerateActivity(false);
        if(resAiCurrent != null){
            if(!resAiCurrent.r){
                toast.error(resAiCurrent.msg);
                return
            };
            
            setCurrentActivity(resAiCurrent);
            dispatch(setResAiCurrent(null));
            getPropsOfUser();
            toast.success(resAiCurrent.msg);
        };
    }, [resAiCurrent]);

    const getPropsOfUser = async () => {
        const accessToken = Cookies.get(KEY_COOKIE_ACCESS);
        const response = await AiCorrigeApi.verifyAccessToken(accessToken);

        if(!response.r){
            toast.error(response.data.msg);
            return
        };

        const data = response.data.user;

        dispatch(setUserData(data));
        setCurrentUserData(data);
        setDataModalActivitiesPending(data.questions);
        setDifficultyColor(filterDifficultyColor(data.queries != undefined && data.queries[textSubject] != undefined? currentUserData.queries[textSubject]["totalNote"]:0));
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
            toast.error(typeof response.data.msg == Array? response.data.msg.join("\n"):response.data.msg);
            setIsLoadingGenerateActivity(false);
        };

        toast.success(response.data.msg);
    };

    const filterActivitiesPendingByInput = (text) => {
        const replaceText = text.replaceAll(" ", "_").toLowerCase();
        let data = [];

        if(text == "") return currentUserData.questions;

        currentUserData.questions.forEach(activity => {
            if(activity.data.data.title === replaceText){
                data.push(activity);
            };
        });

        return data;
    };

    return(
        <>
            <div className="display-home">
                {
                    currentUserData != null &&
                    <div className="area-action-buttons">
                        <Button onClick={() => {
                            setIsOpenModalActivitiesPending(true)
                        }} color="orange" icon="clock outline" size="mini" content={`Atividades pendentes: ${currentUserData.questions.length}`} />
                    </div>
                }
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
                                                setCurrentActivity(null);
                                                setTextSubjectTitle(ev.target.innerText.replaceAll(" ", "_").toLowerCase());
                                                console.log(ev.target.innerText.replaceAll(" ", "_").toLowerCase())
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
                                                                <Header icon={
                                                                    (difficultyColor == 1 ||
                                                                    difficultyColor == 2 ||
                                                                    difficultyColor == 3)? "lock open":"lock"
                                                                } size="tiny" content="0 pontos" subheader="Nível fácil" />
                                                            </>
                                                        } color={
                                                            (difficultyColor == 1 ||
                                                            difficultyColor == 2 ||
                                                            difficultyColor == 3)? "green":null
                                                        }/>
                                                        <Label content={
                                                            <>
                                                                <Header icon={
                                                                    (difficultyColor == 2 ||
                                                                    difficultyColor == 3)? "lock open":"lock"
                                                                } size="tiny" content="100 pontos" subheader="Nível médio" />
                                                            </>
                                                        } color={
                                                            (difficultyColor == 2 ||
                                                            difficultyColor == 3)? "green":null
                                                        }/>
                                                        <Label content={
                                                            <>
                                                                <Header icon={difficultyColor == 3? "lock open":"lock"} 
                                                                size="tiny" content="200 pontos" subheader="Nível difícil" />
                                                            </>
                                                        } color={
                                                            difficultyColor == 3? "green":null
                                                        }/>
                                                    </Label.Group>
                                                </Form.Field>
                                                <Form.Field>
                                                    <Message size="mini" content={`Sua pontuação: ${currentUserData.queries != undefined && currentUserData.queries[textSubjectTitle] != undefined? 
                                                    currentUserData.queries[textSubjectTitle]["totalNote"]:0}`} />
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
                                                        currentUserData.queries != undefined && currentUserData.queries[textSubjectTitle] != undefined? 
                                                        currentUserData.queries[textSubjectTitle]["totalNote"]:0
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
                <Segment>
                    {
                        isLoadingGenerateActivity?
                        <AiLoading />:
                        "Adquira conhecimento, gere sua atividade, pode deixar comigo. (;"
                    }

                </Segment>
                {
                    currentActivity != null &&
                    <CreateActivity 
                    date={currentActivity.createdAt} 
                    title={currentActivity.data.data.title} 
                    difficulty={textDifficulty}
                    summary={currentActivity.data.data.answer.resumo}
                    question1={currentActivity.data.data.answer.questao1}
                    question2={currentActivity.data.data.answer.questao2}
                    question3={currentActivity.data.data.answer.questao3}
                    question4={currentActivity.data.data.answer.questao4}
                    question5={currentActivity.data.data.answer.questao5}
                    setCurrentActivity={setCurrentActivity}
                    getPropsOfUser={getPropsOfUser}
                    />
                }
            </div>

            {/* Modal - activities pending */}
                <Modal
                onClose={() => setIsOpenModalActivitiesPending(false)}
                onOpen={() => setIsOpenModalActivitiesPending(true)}
                open={isOpenModalActivitiesPending}
                >
                <Modal.Header>Atividades pendentes</Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <label>Assunto:</label>
                                <Dropdown
                                placeholder="Escolha um assunto!"
                                selection
                                fluid
                                clearable
                                options={OPTIONS_INPUT_THEME}
                                onChange={(ev, data) => setDataModalActivitiesPending(filterActivitiesPendingByInput(ev.target.innerText))}
                                />
                                <div  className="display-quantidade">Quantidade: {dataModalActivitiesPending != null && dataModalActivitiesPending.length}</div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                {
                                    dataModalActivitiesPending != null && dataModalActivitiesPending.length > 0?
                                    <div className="area-modal-activities-pending">
                                        {   
                                            dataModalActivitiesPending != null && dataModalActivitiesPending.map(question => (
                                                <Segment size="mini" key={question.createdAt}>
                                                    <div className="area-modal-activity-pending">
                                                        <div className="info">
                                                            <Header 
                                                            content={question.data.data.title.charAt(0).toUpperCase().replaceAll("_", " ") + question.data.data.title.slice(1).replaceAll("_", " ")} 
                                                            subheader={moment(question.createdAt).format("DD/MM/YYYY - HH:MM")} 
                                                            />
                                                        </div>
                                                        <div className="btn">
                                                            <Button onClick={() => {
                                                                setCurrentActivity(question);
                                                                setIsOpenModalActivitiesPending(false);
                                                            }} color="green" size="mini" content="Ver"/>
                                                        </div>
                                                    </div>
                                                </Segment>
                                            ))
                                        }
                                    </div>:<Message content="Nenhuma atividade pendente!" />
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button size="mini" color='red' onClick={() => setIsOpenModalActivitiesPending(false)}>
                        Fechar
                    </Button>
                </Modal.Actions>
                </Modal>
            {/* Modal - activities pending */}
        </>
    );
};

export default Home;