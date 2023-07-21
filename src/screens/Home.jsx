import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Dropdown, Form, Grid, Header, Icon, Image, Input, Label, Loader, Message, Modal, Pagination, Popup, Progress, Segment, Step, Tab, Table } from "semantic-ui-react";
import store, { setBadTicket, setResAiCurrent, setUserData } from "../store";
import suportLogoUser from "../img/suporte-user.png";
import { KEY_COOKIE_ACCESS, OPTIONS_DIFFICULTY, OPTIONS_INPUT_THEME, OPTIONS_INPUT_THEME_PENDING, OPTIONS_INPUT_THEME_PENDING_AND_QUERIES, OPTIONS_INPUT_THEME_QUERIES, OPTIONS_THEME } from "../utils/constants";
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
    const [isLoadingGenerateActivity, setIsLoadingGenerateActivity] = useState(false);
    const [viewPane, setViewPane] = useState(0);
    // Global

    // Search area custom
    const [textSubjectCustom, setTextSubjectCustom] = useState("");
    // Search area custom

    // Community
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(0);
    const [dataTableCommunity, setDataTableCommunity] = useState(null);
    const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);
    // Community

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
        setIsLoadingGenerateActivity(false);
        if(isLoadingGenerateActivity){
            if(resAiCurrent != null){
                if(!resAiCurrent.r){
                    toast.error(resAiCurrent.msg);
                    return
                };
                
                setCurrentActivity(resAiCurrent);
                dispatch(setResAiCurrent(null));
                getPropsOfUser();
                toast.success("Atividade gerada com sucesso!");
                themes(1);
            };
        };
        
        if(resAiCurrent !== null && !isLoadingGenerateActivity){
            getPropsOfUser();
            toast.success("Nova atividade pendente!");
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

        OPTIONS_INPUT_THEME_PENDING.splice(0, OPTIONS_INPUT_THEME_PENDING.length+1);
        OPTIONS_INPUT_THEME_QUERIES.splice(0, OPTIONS_INPUT_THEME_QUERIES.length+1);
        setAllKeysActivitiesInQueries(data);
        setAllKeysActivitiesPending(data);
        dispatch(setUserData(data));
        setCurrentUserData(data);
        setDataModalActivitiesPending(data.questions);
        setDataModalActivitiesQueries(getAllActivitiesInQueries(data));
        setDifficultyColor(filterDifficultyColor(data.queries != undefined && data.queries[textSubjectT] != undefined? parseInt(currentUserData.queries[textSubjectT]["totalNote"]):0));
    };

    const aiJsonAmqpCustom = async (text = undefined) => {

        setIsLoadingGenerateActivity(true);

        const dataText = text || textSubjectCustom;

        /* console.log(dataText) */

        const data = {
            title: dataText.trim().replace(/\s/g, "_").toLowerCase(),
            msg: dataText.charAt(0).toUpperCase().replaceAll("_", " ") + dataText.slice(1).replaceAll("_", " ")
        };

        setTextSubjectCustom("");

        const response = await AiCorrigeApi.aiJsonAmqpCustom(data.title, data.msg);

        if(!response.r){
            toast.error(typeof response.data.msg == Array? response.data.msg.join("\n"):response.data.msg);
            setIsLoadingGenerateActivity(false);

            if(response.data.msg === "Tickets insuficientes!"){
                store.dispatch(setBadTicket(true));
            };
            
            return
        };

        toast.success(response.data.msg);
    };

    const filterActivitiesPendingByInput = (text) => {
        const replaceText = text.replaceAll(" ", "_").toLowerCase();
        let data = [];

        /* console.log(text) */

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

        return []
    };

    const setAllKeysActivitiesInQueries = (data) => {
        if(data.queries != undefined){
            Object.keys(data.queries).forEach(theme => {
                if(!OPTIONS_INPUT_THEME_QUERIES.find(theme2 => theme2.text.replaceAll(" ", "_").toLowerCase() === theme)){
                    OPTIONS_INPUT_THEME_QUERIES.push({
                        key: theme, 
                        text: theme.charAt(0).toUpperCase().replaceAll("_", " ") + theme.slice(1).replaceAll("_", " "), 
                        value: theme
                    })
                };
            });

        }; 
    };

    const setAllKeysActivitiesPending = (data) => {
        /* console.log(data) */
        if(data.questions != undefined){
            data.questions.forEach(theme => {
                if(!OPTIONS_INPUT_THEME_PENDING.find(theme2 => theme2.text.replaceAll(" ", "_").toLowerCase() === theme.data.data.title)){
                    OPTIONS_INPUT_THEME_PENDING.push({
                        key: theme.data.data.title, 
                        text: theme.data.data.title.charAt(0).toUpperCase().replaceAll("_", " ") + theme.data.data.title.slice(1).replaceAll("_", " "), 
                        value: theme.data.data.title
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

    const themes = async (page, click = false) => {
        !click && setIsLoadingCommunity(true);
        const response = await AiCorrigeApi.themes(page);
        setIsLoadingCommunity(false);

        if(!response.r){
            toast.error(response.data.msg);
            return
        };

        const data = response.data;
        const configsData = response.data;
        /* console.log(response.data); */
        setDataTableCommunity(data.data);
        setMaxPage(parseInt(configsData.pages));
    };

    const renderCommunity = () => {

        return(
            <>
                {
                    isLoadingCommunity || isLoadingGenerateActivity ? 
                    <>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    </>:
                    <Segment textAlign="left">
                        <Header content="Buscas da comunidade" subheader="Assuntos mais pesquisados por outros usuários." />
                        <div className="community-area-overflow">
                            <Table size="small" unstackable celled>
                                <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Assunto</Table.HeaderCell>
                                    <Table.HeaderCell>Buscas</Table.HeaderCell>
                                    <Table.HeaderCell></Table.HeaderCell>
                                </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                        {
                                            dataTableCommunity != null && dataTableCommunity.map((query, index) => (
                                                <Table.Row key={index}>
                                                    <Table.Cell>{query.theme.charAt(0).toUpperCase().replaceAll("_", " ") + query.theme.slice(1).replaceAll("_", " ")}</Table.Cell>
                                                    <Table.Cell>{query.total}</Table.Cell>
                                                    <Table.Cell collapsing>
                                                        <Button 
                                                        color="green"
                                                        icon="send"
                                                        content="Gerar atividade"
                                                        size="mini"
                                                        onClick={() => {
                                                            aiJsonAmqpCustom(
                                                                query.theme.charAt(0).toUpperCase().replaceAll("_", " ") + query.theme.slice(1).replaceAll("_", " ")
                                                            );
                                                            setCurrentActivity(null);
                                                        }}
                                                        />
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))
                                        }
                                </Table.Body>

                                <Table.Footer>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan="8">
                                            <Pagination
                                                activePage={page}
                                                totalPages={maxPage}
                                                ellipsisItem={null}
                                                boundaryRange={1}
                                                size="mini"
                                                siblingRange={0}
                                                onPageChange={(e, data) => {
                                                    setPage(data.activePage);
                                                    themes(data.activePage, true);
                                                }}
                                            />
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Footer>
                            </Table>
                        </div>
                    </Segment>
                }
            </>
        );
    };

    const renderCustom = () => {
        return(
            <Segment textAlign="left">
                <Header content="Nova atividade" subheader="Solicite uma atividade sobre qualquer assunto que você imaginar, pode deixar comigo. (;" />
                <Form onSubmit={() => aiJsonAmqpCustom()}>
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
                                }} disabled={isLoadingGenerateActivity || textSubjectCustom === ""} type="submit" color="green" icon="send" />
                            </div>
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Segment>
        );
    };

    const panes = [
        {
          menuItem: 'Gerar atividade',
          render: () => renderCustom(),
        },
        {
          menuItem: 'Comunidade',
          render: () => renderCommunity(),
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
                <Tab activeIndex={viewPane} onTabChange={(ev, data) => {
                    setViewPane(data.activeIndex);

                    if(data.activeIndex === 1){
                        themes(1);
                        setPage(1);
                    };
                }} menu={{ secondary: true, pointing: true }} panes={panes} />
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
                                selection
                                fluid
                                value={textSelectedInputActvPending}
                                clearable
                                options={OPTIONS_INPUT_THEME_PENDING}
                                onChange={(ev, data) => {
                                    if(ev.type !== "blur"){
                                        setDataModalActivitiesPending(filterActivitiesPendingByInput(ev.target.innerText));
                                        setTextSelectedInputActvPending(data.value);
                                    };
                                }}
                                />
                                <Label size="small" 
                                content={`Quantidade: ${dataModalActivitiesPending != null && dataModalActivitiesPending.length}`} 
                                className="margin-top-mini" 
                                color="teal"
                                />
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
                                <div className="area-cadastro-line-global">
                                    <Dropdown
                                    placeholder="Escolha um assunto!"
                                    selection
                                    fluid
                                    value={textSelectedInputActvQueries}
                                    clearable
                                    options={OPTIONS_INPUT_THEME_QUERIES}
                                    onChange={(ev, data) => {
                                        if(ev.type !== "blur"){
                                            setDataModalActivitiesQueries(filterActivitiesInQueriesByInput(ev.target.innerText));
                                            setTextSelectedInputActvQueries(data.value);
                                        };
                                    }}
                                    />
                                    <Button onClick={() => {
                                        setIsOpenModalActivitiesQueries(false);
                                        aiJsonAmqpCustom(textSelectedInputActvQueries);
                                    }} content="Gerar novamente" color="green" size="mini" disabled={textSelectedInputActvQueries === ""} />
                                </div>
                                <Label size="small" 
                                content={`Quantidade: ${dataModalActivitiesQueries != null && dataModalActivitiesQueries.length}`} 
                                className="margin-top-mini" 
                                color="teal"
                                />
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
                                    </div>:<Message content="Nenhuma atividade respondida!" />
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