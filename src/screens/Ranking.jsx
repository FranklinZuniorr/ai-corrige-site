import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Container, Divider, Dropdown, Form, Header, Input, Message, Segment, Table } from "semantic-ui-react";
import { OPTIONS_INPUT_THEME } from "../utils/constants";
import AiCorrigeApi from "../services/AiCorrigeApi";
import { toast } from "react-hot-toast";
import suportImage from "../img/suporte-user.png"
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import store from "../store";
import { pastValue } from "../utils/FnUtils";

const Ranking = () => {
    const navigate = useNavigate();
    const access = useSelector(store => store.userData);

    // Table
    const [dataTable, setDataTable] = useState(null);
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    // Table

    // Global
    const [isLoadingOnStart, setIsLoadingOnStart] = useState(true);
    // Global

    // Input
    const [textSelectedInputActv, setTextSelectedInputActv] = useState("");
    // Input

    // Area new externalUrl
    const [isLoadingBtnNewUrl, setIsLoadingBtnNewUrl] = useState(false);
    const [textInputNewUrl, setTextInputNewUrl] = useState("");
    // Area new externalUrl

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
                    <Header 
                    size="tiny" 
                    content="Seja descoberto" 
                    subheader="Ao ficar no top 10 é possível mostrar um link de alguma rede social sua ou algo sobre você aos outros usuários." 
                    />
                    <Input
                    size="mini"
                    value={textInputNewUrl}
                    onChange={(ev, data) => setTextInputNewUrl(data.value)}
                    action={
                        <>
                        <Button onClick={async () => setTextInputNewUrl(await pastValue())} size="mini" icon="paste" />
                        <Button onClick={setExternalUrl} size="mini" icon="paper plane" color="green" />
                        </>
                    }
                    placeholder="Insira seu link aqui..."
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
                                                        user.externalLink == ""?
                                                        <Message content="Não quer ser descoberto." />:
                                                        <Button onClick={() => window.open(user.externalLink)} content="Descobrir" color="green" size="mini" />
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