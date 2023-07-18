import React from "react";
import { useNavigate } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Breadcrumb, Container, Divider, Dropdown, Header, Icon, List, Message, Segment } from "semantic-ui-react";
import { KEY_COOKIE_ACCESS, OPTIONS_INPUT_THEME } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import AiCorrigeApi from "../services/AiCorrigeApi";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { setUserData } from "../store";
import moment from "moment";
import { filterDifficultyNumber } from "../utils/FnUtils";

const Statistics = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const access = useSelector(store => store.userData);

    const [dataChart, setDataChart] = useState(null);
    const [noteTotal, setNoteTotal] = useState(0);
    const [useTotal, setUseTotal] = useState(0);
    const [media, setMedia] = useState(0);
    const [mediaDays, setMediaDays] = useState(0);
    const [easyTotal, setEasyTotal] = useState(0);
    const [mediumTotal, setMediumTotal] = useState(0);
    const [hardTotal, setHardTotal] = useState(0);

    const setDataChartFilter = (text) => {
        const queries = access.queries !== undefined? access.queries[text]:undefined;
        
        
        if(queries != undefined){
            let data = [];
            let use = 0;
            let time = 0;
            let easy = 0;
            let medium = 0;
            let hard = 0;
            
            // Data
            queries.arr.forEach((query, index) => {
                data.push({
                    name: `${moment(query.createdAt).utc().format("DD/MM/YYYY HH:mm:ss")} - ${filterDifficultyNumber(parseInt(query.note))}`, 
                    nota: query.totalNote,
                    max: query.note*5
                })
            });

            // Use
            queries.arr.forEach((query, index) => {
                const dataIT = moment(query.createdAt).format("YYYY-MM-DD");
                const dataET = moment().format("YYYY-MM-DD");
                const dateStart = moment(dataIT);
                const dateEnd = moment(dataET);
                const qtdDays = dateEnd.diff(dateStart, 'days');

                use+=query.totalNote/(query.note*5);
                time+= qtdDays

                if(parseInt(query.note) === 2) easy++
                if(parseInt(query.note) === 3) medium++
                if(parseInt(query.note) === 5) hard++
            });

            setEasyTotal(easy);
            setMediumTotal(medium); 
            setHardTotal(hard);

            console.log(data);
            setDataChart(data);
            setNoteTotal(queries.totalNote);
            setUseTotal(((use/queries.arr.length)*100).toFixed(2) >= 100? 100:((use/queries.arr.length)*100).toFixed(2));
            setMedia(queries.totalNote/queries.arr.length);
        }else{
            setDataChart(null);
        };
    };

    return(
        <>
            <div className="display-statistics">
                <Container textAlign="left" fluid>
                    <Breadcrumb>
                        <Breadcrumb.Section onClick={() => navigate("/")} link>Tela principal</Breadcrumb.Section>
                        <Breadcrumb.Divider icon='right arrow' />
                        <Breadcrumb.Section active>Estatísticas</Breadcrumb.Section>
                    </Breadcrumb>
                </Container>

                <Segment textAlign="left" >
                    <Header content="Estatísticas" subheader="Métricas relacionadas as respostas de atividades." />
                    <Divider />
                    <label>Assunto:</label>
                    <Dropdown
                    placeholder="Escolha um assunto!"
                    search
                    selection
                    fluid
                    clearable
                    options={OPTIONS_INPUT_THEME}
                    onChange={(ev, data) => {
                        setDataChartFilter(ev.target.innerText.replaceAll(" ", "_").toLowerCase());
                        /* getTop10(ev.target.innerText.replaceAll(" ", "_").toLowerCase());
                        setTextSelectedInputActv(ev.target.innerText.replaceAll(" ", "_").toLowerCase()); */
                    }}
                    />
                </Segment>

                <Segment>
                    {
                        dataChart != null?
                        <>
                            <Header textAlign="left" content="Evolução" subheader="Gráfico referente as notas do assunto selecionado."/>
                            <ResponsiveContainer width="100%" height={150}>
                                <AreaChart
                                data={dataChart}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                                >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area name="Nota máxima" type="monotone" dataKey="max" stroke="#73cf93" fill="#73cf93" />
                                <Area name="Nota" type="monotone" dataKey="nota" stroke="#287242" fill="#287242" />
                                </AreaChart>
                            </ResponsiveContainer>
                            <Divider />
                            <Segment color={useTotal >= 50? "green":"red"} textAlign="left">
                                <Header textAlign="left" content="Dados:"/>
                                <List bulleted>
                                    <List.Item>Aproveitamento: {useTotal}% <Icon className="circle" color={useTotal >= 50? "green":"red"}/></List.Item>
                                    <List.Item>Nota total: {noteTotal}</List.Item>
                                    <List.Item>Média de notas: {media.toFixed(2)}</List.Item>
                                    <List.Item>Atividades respondidas: {dataChart.length}</List.Item>
                                    <List.Item>Atividades Fáceis: {easyTotal}</List.Item>
                                    <List.Item>Atividades Médias: {mediumTotal}</List.Item>
                                    <List.Item>Atividades difíceis: {hardTotal}</List.Item>
                                </List>
                            </Segment>
                        </>:<Message content="Gere e responda atividades para ter acesso as métricas de evolução." />
                    }
                </Segment>
            </div>
        </>
    );
};

export default Statistics;