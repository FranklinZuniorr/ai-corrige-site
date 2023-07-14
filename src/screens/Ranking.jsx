import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Container, Divider, Dropdown, Form, Header, Icon, Input, Item, Label, Loader, Message, Segment, Table } from "semantic-ui-react";
import { KEY_COOKIE_ACCESS, OPTIONS_INPUT_THEME } from "../utils/constants";
import AiCorrigeApi from "../services/AiCorrigeApi";
import { toast } from "react-hot-toast";
import suportImage from "../img/suporte-user.png"
import { Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import store, { setUserData } from "../store";
import { pastValue } from "../utils/FnUtils";
import Cookies from "js-cookie";

const Ranking = () => {
    const navigate = useNavigate();
    const access = useSelector(store => store.userData);
    const dispatch = useDispatch();

    // Table
    const [dataTable, setDataTable] = useState(null);
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    // Table

    // Global
    const [isLoadingOnStart, setIsLoadingOnStart] = useState(true);
    const [currentUserData, setCurrentUserData] = useState(null);
    // Global

    // Input
    const [textSelectedInputActv, setTextSelectedInputActv] = useState("");
    // Input

    // Area new externalUrl
    const [isLoadingBtnNewUrl, setIsLoadingBtnNewUrl] = useState(false);
    const [textInputNewUrl, setTextInputNewUrl] = useState("");
    // Area new externalUrl

    useEffect(() => {
        getPropsOfUser();
    }, []);

    const getTop10 = async (text) => {
        setIsLoadingTable(true);
        const response = await AiCorrigeApi.getTop10(text);
        setIsLoadingTable(false);

        if(!response.r){
            toast.error(response.data.msg);
            return
        };

        console.log(response)

        toast.success(response.data.msg);
        const data = response.data.list;

        setDataTable(data);
    };

    const setExternalUrl = async () => {
        setIsLoadingBtnNewUrl(true);
        const response = await AiCorrigeApi.setExternalUrl(textInputNewUrl);
        setIsLoadingBtnNewUrl(false);

        if(!response.r){
            toast.error(response.data.msg);
            return
        };

        toast.success(response.data.msg);
        setTextInputNewUrl("");
        getPropsOfUser();

    };

    const getPropsOfUser = async () => {
        const accessToken = Cookies.get(KEY_COOKIE_ACCESS);
        const response = await AiCorrigeApi.verifyAccessToken(accessToken);
        setIsLoadingOnStart(false);

        if(!response.r){
            toast.error(response.data.msg);
            return
        };

        const data = response.data.user;

        dispatch(setUserData(data));
        setCurrentUserData(data);
    };

    return(
        <>
            <div className="display-ranking">
                <Container textAlign="left" fluid>
                    <Breadcrumb>
                        <Breadcrumb.Section onClick={() => navigate("/")} link>Tela principal</Breadcrumb.Section>
                        <Breadcrumb.Divider icon='right arrow' />
                        <Breadcrumb.Section active>Ranking</Breadcrumb.Section>
                    </Breadcrumb>
                </Container>

                <Segment textAlign="left">
                    <Header content="Ranking" subheader="Top 10 melhores pontuações." />
                    <Divider />
                    <label>Assunto:</label>
                    <Dropdown
                    placeholder="Escolha um assunto!"
                    selection
                    fluid
                    clearable
                    options={OPTIONS_INPUT_THEME}
                    onChange={(ev, data) => {
                        getTop10(ev.target.innerText.replaceAll(" ", "_").toLowerCase());
                        setTextSelectedInputActv(ev.target.innerText.replaceAll(" ", "_").toLowerCase());
                    }}
                    />
                </Segment>

                <Segment textAlign="left">
                    <Item className="margin-bottom-mini">
                        <Item.Content>
                            <Item.Header><Header content="Seja descoberto" /></Item.Header>
                            <Item.Meta>Ao ficar no top 10 é possível mostrar um link de alguma rede social sua ou algo sobre você aos outros usuários.</Item.Meta>
                            <Item.Description>
                                <Label size="mini">
                                    {
                                        isLoadingOnStart? <Loader size="mini" active inline="centered" />:
                                        <>
                                            <Icon loading={isLoadingBtnNewUrl} name='linkify' />
                                            {(currentUserData != null && currentUserData.externalUrl != undefined)? 
                                            `${currentUserData.externalUrl.slice(0, Math.floor(currentUserData.externalUrl.length*0.2))}.....
                                            ${currentUserData.externalUrl.slice(-Math.floor(currentUserData.externalUrl.length*0.2))}`:"Nenhum link adicionado."}
                                        </>
                                    }
                                </Label>
                            </Item.Description>
                        </Item.Content>
                    </Item>
                    <Input
                    size="mini"
                    value={textInputNewUrl}
                    onChange={(ev, data) => setTextInputNewUrl(data.value)}
                    action={
                        <>
                        <Button onClick={async () => setTextInputNewUrl(await pastValue())} size="mini" icon="paste" />
                        <Button loading={isLoadingBtnNewUrl} onClick={setExternalUrl} size="mini" icon="paper plane" color="green" />
                        </>
                    }
                    placeholder="Insira o seu link aqui..."
                    />
                </Segment>

                {
                    isLoadingTable? 
                    <>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton height={100} animation="wave" variant="rectangular" />
                    </>:
                    <>
                        {
                            textSelectedInputActv != "" &&
                            <Container textAlign="left" fluid>
                                <Header 
                                textAlign="left"
                                content={`Sua nota: ${access.queries[textSelectedInputActv] !== undefined? access.queries[textSelectedInputActv]["totalNote"]:0 }`} 
                                subheader="Essa é a sua nota atual referente ao assunto escolhido."
                                />
                                {
                                    dataTable != null && !dataTable.find(user => user.email == access.email) &&
                                    <Message size="small" color="blue" content="Solicite e responda atividades para ficar entre os 10 melhores. (:" />
                                }
                            </Container>
                        }
                        {
                            dataTable != null && dataTable.length > 0?
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>N°</Table.HeaderCell>
                                        <Table.HeaderCell>Usuário</Table.HeaderCell>
                                        <Table.HeaderCell>Link externo</Table.HeaderCell>
                                        <Table.HeaderCell>Nota</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {
                                        dataTable != null && dataTable.map((user, index) => (
                                            <Table.Row key={index}>
                                                <Table.Cell collapsing>{`${index+1}°`}</Table.Cell>
                                                <Table.Cell><Header size="small" content={user.username} subheader={user.email} image={user.img || suportImage}/></Table.Cell>
                                                <Table.Cell>
                                                    {
                                                        user.externalUrl === ""?
                                                        <Message size="mini" content="Não quer ser descoberto." />:
                                                        <Button onClick={() => window.open(user.externalUrl)} content="Descobrir" color="green" size="mini" />
                                                    }
                                                </Table.Cell>
                                                <Table.Cell>{user.queries[Object.keys(user.queries)[0]]["totalNote"]}</Table.Cell>
                                            </Table.Row>
                                        ))
                                    }
                                </Table.Body>
                            </Table>:<Message content="Nada por enquanto!" />
                        }
                    </>
                }

            </div>
        </>
    );
};

export default Ranking; 