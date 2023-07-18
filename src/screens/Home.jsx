import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Dropdown, Form, Grid, Header, Icon, Image, Input, Label, Loader, Message, Modal, Popup, Progress, Segment, Step, Tab } from "semantic-ui-react";
import store, { setResAiCurrent, setUserData } from "../store";
import suportLogoUser from "../img/suporte-user.png";
import { KEY_COOKIE_ACCESS, OPTIONS_DIFFICULTY, OPTIONS_INPUT_THEME, OPTIONS_INPUT_THEME_PENDING_AND_QUERIES, OPTIONS_THEME } from "../utils/constants";
import { filterDifficulty, filterDifficultyColor, filterDifficultyText, obterPorcentagem } from "../utils/FnUtils";
import AiCorrigeApi from "../services/AiCorrigeApi";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import AiLoading from "../components/AiLoading";
import CreateActivity from "../components/CreateActivity";
import moment from "moment";
import ViewActivityRes from "../components/ViewActivityRes";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";

const Home = () => {

    const resAiCurrent = useSelector(store => store.resAiCurrent);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Global
    const [currentUserData, setCurrentUserData] = useState(null);
    const [currentActivity, setCurrentActivity] = useState(null);
    const [difficultyColor, setDifficultyColor] = useState(0);
    const [isLoadingOnStart, setIsLoadingOnStart] = useState(true);
    // Global

    // Search area
    const [textSubject, setTextSubject] = useState("");
    const [textSubjectTitle, setTextSubjectTitle] = useState("");
    const [textDifficulty, setTextDifficulty] = useState("Fácil");
    const [isLoadingGenerateActivity, setIsLoadingGenerateActivity] = useState(false);
    // Search area

    // Search area custom
    const [textSubjectCustom, setTextSubjectCustom] = useState("");
    // Search area custom

    // Modal activities pending
    const [isOpenModalActivitiesPending, setIsOpenModalActivitiesPending] = useState(false);
    const [dataModalActivitiesPending, setDataModalActivitiesPending] = useState(null);
    const [textSelectedInputActvPending, setTextSelectedInputActvPending] = useState("");
    // Modal activities pending

    // Modal activities queries
    const [isOpenModalActivitiesQueries, setIsOpenModalActivitiesQueries] = useState(false);
    const [dataModalActivitiesQueries, setDataModalActivitiesQueries] = useState(null);
    const [viewMoreDetails, setViewMoreDetails] = useState(false);
    const [textSelectedInputActvQueries, setTextSelectedInputActvQueries] = useState("");
    // Modal activities queries

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
            toast.success("Atividade gerada com sucesso!");
        };
    }, [resAiCurrent]);

    const getPropsOfUser = async (textSubjectT) => {
        const accessToken = Cookies.get(KEY_COOKIE_ACCESS);
        const response = await AiCorrigeApi.verifyAccessToken(accessToken);
        setIsLoadingOnStart(false);

        if(!response.r){
            toast.error(response.data.msg);
            return
        };

        const data = response.data.user;

        setAllKeysActivitiesInQueries(data);
        dispatch(setUserData(data));
        setCurrentUserData(data);
        setDataModalActivitiesPending(data.questions);
        setDataModalActivitiesQueries(getAllActivitiesInQueries(data));
        setDifficultyColor(filterDifficultyColor(data.queries != undefined && data.queries[textSubjectT] != undefined? parseInt(currentUserData.queries[textSubjectT]["totalNote"]):0));
    };

    const aiJsonAmqp = async () => {

        setTextSubject("");
        setIsLoadingGenerateActivity(true);

        const data = {
            title: OPTIONS_INPUT_THEME.find(input => input.value == textSubject).text.replaceAll(" ", "_").toLowerCase(),
            msg: textSubject,
            difficulty: textDifficulty,
            note: filterDifficultyText(textDifficulty)
        };

        const response = await AiCorrigeApi.aiJsonAmqp(data.title, data.msg, data.difficulty, data.note);

        if(!response.r){
            toast.error(typeof response.data.msg == Array? response.data.msg.join("\n"):response.data.msg);
            setIsLoadingGenerateActivity(false);
            return
        };

        toast.success(response.data.msg);
    };

    const aiJsonAmqpCustom = async () => {

        setTextSubjectCustom("");
        setIsLoadingGenerateActivity(true);

        const data = {
            title: textSubjectCustom.replaceAll(" ", "_").toLowerCase(),
            msg: textSubjectCustom
        };

        const response = await AiCorrigeApi.aiJsonAmqpCustom(data.title, data.msg);

        if(!response.r){
            toast.error(typeof response.data.msg == Array? response.data.msg.join("\n"):response.data.msg);
            setIsLoadingGenerateActivity(false);
            return
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

    const sumTotalActivitiesInQueries = () => {
        let qtd = 0;
        currentUserData.queries != undefined && Object.keys(currentUserData.queries).forEach(theme => qtd+= currentUserData.queries[theme]["arr"]["length"]);
        return qtd
    };

    const getAllActivitiesInQueries = (data) => {
        if(data.queries != undefined){
            const dataAll = [];
            Object.keys(data.queries).forEach(theme => dataAll.push(...data.queries[theme]["arr"]));

            return dataAll;
        }; 

        return null
    };

    const setAllKeysActivitiesInQueries = (data) => {
        if(data.queries != undefined){
            const dataAll = [];

            Object.keys(data.queries).forEach(theme => {
                if(!OPTIONS_INPUT_THEME_PENDING_AND_QUERIES.find(theme2 => theme2.text.replaceAll(" ", "_").toLowerCase() === theme)){
                    OPTIONS_INPUT_THEME_PENDING_AND_QUERIES.push({
                        key: theme, 
                        text: theme.charAt(0).toUpperCase().replaceAll("_", " ") + theme.slice(1).replaceAll("_", " "), 
                        value: theme
                    })
                };
            });

        }; 
    };

    const filterActivitiesInQueriesByInput = (text) => {
        const replaceText = text.replaceAll(" ", "_").toLowerCase();

        if(text == "") return getAllActivitiesInQueries(currentUserData);

        if(currentUserData.queries != undefined && currentUserData.queries[replaceText] != undefined){
            return currentUserData.queries[replaceText]["arr"];
        }

        return []
    };

    const renderDefault = () => {
        return(
            <Segment>
                <Header textAlign="left" content="Gerar atividade" />
                <Grid>
                    <Grid.Row verticalAlign="middle" textAlign="left">
                        <Grid.Column>
                            <Form className="area-form-home-search" onSubmit={() => aiJsonAmqp()}>
                                <Form.Group>
                                    <Form.Field width={16}>
                                        <label>Assunto:</label>
                                        <Dropdown
                                        placeholder="Escolha um assunto!"
                                        disabled={isLoadingGenerateActivity}
                                        selection
                                        search
                                        clearable
                                        value={textSubject}
                                        options={OPTIONS_INPUT_THEME}
                                        onChange={(ev, data) => {
                                            getPropsOfUser(ev.target.innerText.replaceAll(" ", "_").toLowerCase());
                                            setTextSubject(data.value);
                                            setCurrentActivity(null);
                                            setTextSubjectTitle(ev.target.innerText.replaceAll(" ", "_").toLowerCase());
                                        }}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Field>
                                        {
                                            (textSubject != "" && currentUserData != null) &&
                                            <>
                                                <Header 
                                                size="small"
                                                content={`Sua nota: ${currentUserData.queries != undefined && currentUserData.queries[textSubjectTitle] != undefined? 
                                                currentUserData.queries[textSubjectTitle]["totalNote"]:0}`} 
                                                subheader="Essa é a sua nota atual referente ao assunto escolhido."
                                                />
                                            </>
                                        }
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
                                                <Progress 
                                                content={
                                                    `${currentUserData.queries != undefined && currentUserData.queries[textSubjectTitle] != undefined? 
                                                    currentUserData.queries[textSubjectTitle]["totalNote"]:0}/200 - ${obterPorcentagem(
                                                        currentUserData.queries != undefined && currentUserData.queries[textSubjectTitle] != undefined? 
                                                        currentUserData.queries[textSubjectTitle]["totalNote"]:0, 200
                                                    )}`
                                                } 
                                                size="tiny" 
                                                value={
                                                    currentUserData.queries != undefined && currentUserData.queries[textSubjectTitle] != undefined? 
                                                    currentUserData.queries[textSubjectTitle]["totalNote"]:0
                                                } 
                                                total={200} 
                                                indicating 
                                                />
                                            </Form.Field>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Field>
                                                <label>Dificuldade:</label>
                                                <Dropdown 
                                                value={textDifficulty}
                                                placeholder="Escolha um nível!"
                                                selection
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
        );
    };

    const renderCustom = () => {
        return(
            <Segment textAlign="left">
                <Header content="Gerar atividade personalizada" subheader="Atividades personalizadas não soman pontuação, não aparecem no ranking e não são estatísticas." />
                <Form onSubmit={aiJsonAmqpCustom}>
                    <Form.Group>
                        <Form.Field width={16}>
                            <label>Assunto:</label>
                            <div className="area-cadastro-line-global">
                                <Input 
                                placeholder="Escreva um assunto!"
                                value={textSubjectCustom}
                                onChange={(ev, data) => {
                                    setTextSubjectCustom(data.value.slice(0, 50));
                                    setCurrentActivity(null);
                                }}
                                />
                                <Button onClick={() => {
                                    setCurrentActivity(null);
                                }} disabled={isLoadingGenerateActivity} type="submit" color="green" icon="send" />
                            </div>
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Segment>
        );
    };

    const panes = [
        {
          menuItem: 'Padrão',
          render: () => renderDefault(),
        },
        {
          menuItem: 'Personalizado',
          render: () => renderCustom(),
        },
    ];

    return(
        <>
            <div className="display-home">
                {   
                    isLoadingOnStart? 
                    <>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    </>:
                    currentUserData != null &&
                    <div className="area-action-buttons">
                        <Button onClick={() => {
                            setIsOpenModalActivitiesPending(true)
                        }} color="orange" icon="clock outline" size="mini" content={`Atividades pendentes: ${currentUserData.questions.length}`} />
                        <Button onClick={() => {
                            setIsOpenModalActivitiesQueries(true)
                        }} color="green" icon="edit" size="mini" content={`Atividades respondidas: ${sumTotalActivitiesInQueries()}`} />
                        <Button onClick={() => {
                            navigate("ranking")
                        }} size="mini" icon="globe" color="blue" content="Ranking" />
                        <Button onClick={() => {
                            navigate("estatísticas")
                        }} size="mini" icon="chart area" color="purple" content="Estatísticas" />
                    </div>
                }
                <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
                {/* {renderDefault()} */}
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
                    note={currentActivity.note}
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
                                search
                                selection
                                fluid
                                value={textSelectedInputActvPending}
                                clearable
                                options={OPTIONS_INPUT_THEME_PENDING_AND_QUERIES}
                                onChange={(ev, data) => {
                                    setDataModalActivitiesPending(filterActivitiesPendingByInput(ev.target.innerText));
                                    setTextSelectedInputActvPending(data.value);
                                }}
                                />
                                <div  className="display-quantidade">Quantidade: {dataModalActivitiesPending != null && dataModalActivitiesPending.length}</div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                {
                                    dataModalActivitiesPending != null && dataModalActivitiesPending.length > 0?
                                    <div className="area-modal-activities">
                                        {   
                                            dataModalActivitiesPending != null && dataModalActivitiesPending.map(question => (
                                                <Segment size="mini" key={question.createdAt}>
                                                    <div className="area-modal-activity">
                                                        <div className="info">
                                                            <Header 
                                                            content={question.data.data.title.charAt(0).toUpperCase().replaceAll("_", " ") + question.data.data.title.slice(1).replaceAll("_", " ")} 
                                                            subheader={moment(question.createdAt).utc().format("DD/MM/YYYY HH:mm:ss")} 
                                                            />
                                                        </div>
                                                        <div className="btn">
                                                            <Button onClick={() => {
                                                                setCurrentActivity(question);
                                                                setIsOpenModalActivitiesPending(false);
                                                                setTextSubject("");
                                                            }} color="orange" size="mini" content="Responder"/>
                                                        </div>
                                                    </div>
                                                    <Divider />
                                                    {`${question.data.data.answer.resumo.slice(0, Math.floor(question.data.data.answer.resumo.length*0.1))}...`}
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

            {/* Modal - activities queries */}
                <Modal
                onClose={() => setIsOpenModalActivitiesQueries(false)}
                onOpen={() => setIsOpenModalActivitiesQueries(true)}
                open={isOpenModalActivitiesQueries}
                >
                <Modal.Header>Atividades respondidas</Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <label>Assunto:</label>
                                <Dropdown
                                placeholder="Escolha um assunto!"
                                search
                                selection
                                fluid
                                value={textSelectedInputActvQueries}
                                clearable
                                options={OPTIONS_INPUT_THEME_PENDING_AND_QUERIES}
                                onChange={(ev, data) => {
                                    setDataModalActivitiesQueries(filterActivitiesInQueriesByInput(ev.target.innerText));
                                    setTextSelectedInputActvQueries(data.value);
                                }}
                                />
                                <div  className="display-quantidade">Quantidade: {dataModalActivitiesQueries != null && dataModalActivitiesQueries.length}</div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                {
                                    dataModalActivitiesQueries != null && dataModalActivitiesQueries.length > 0?
                                    <div className="area-modal-activities">
                                        {   
                                            dataModalActivitiesQueries != null && dataModalActivitiesQueries.map((query, index) => (
                                                <Segment size="mini" key={query.createdAt}>
                                                    <div className="area-modal-activity">
                                                        <div className="info">
                                                            <Header 
                                                            content={query.theme.charAt(0).toUpperCase().replaceAll("_", " ") + query.theme.slice(1).replaceAll("_", " ")} 
                                                            subheader={moment(query.createdAt).utc().format("DD/MM/YYYY HH:mm:ss")} 
                                                            />
                                                        </div>
                                                        <div className="btn">
                                                            {
                                                                (viewMoreDetails !== false && viewMoreDetails === index)?
                                                                <Button onClick={() => setViewMoreDetails(false)} size="mini" color="red" content="Deixar de exibir" />:
                                                                <Button onClick={() => setViewMoreDetails(index)} color="green" size="mini" content="Analisar"/>
                                                            }
                                                        </div>
                                                    </div>
                                                    <Divider />
                                                    {
                                                        viewMoreDetails !== false && viewMoreDetails === index?
                                                        <ViewActivityRes
                                                        note={query.note}
                                                        question1={query.query.questao1}
                                                        question2={query.query.questao2}
                                                        question3={query.query.questao3}
                                                        question4={query.query.questao4}
                                                        question5={query.query.questao5}
                                                        summary={query.query.resumo}
                                                        noteObtained={query.totalNote}
                                                        setViewMoreDetails={setViewMoreDetails}
                                                        />:`${query.query.resumo.slice(0, Math.floor(query.query.resumo.length*0.1))}...`
                                                    }
                                                </Segment>
                                            ))
                                        }
                                    </div>:<Message content="Nenhuma atividade nessa área!" />
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button size="mini" color='red' onClick={() => setIsOpenModalActivitiesQueries(false)}>
                        Fechar
                    </Button>
                </Modal.Actions>
                </Modal>
            {/* Modal - activities queries */}
        </>
    );
};

export default Home;