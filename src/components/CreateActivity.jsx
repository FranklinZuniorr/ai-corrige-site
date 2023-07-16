import React, { useEffect, useState } from "react";
import { Button, Checkbox, Container, Divider, Header, List, Modal, Segment } from "semantic-ui-react";
import AiCorrigeApi from "../services/AiCorrigeApi";
import { toast } from "react-hot-toast";
import moment from "moment";
import ViewActivityRes from "./ViewActivityRes";

const CreateActivity = ({
    date = "Undefined", 
    title = "Undefined", 
    note = 0, 
    summary = "Undefined", 
    question1 = null, 
    question2 = null, 
    question3 = null, 
    question4 = null, 
    question5 = null,
    setCurrentActivity,
    getPropsOfUser
    }) => {
    
    const [selectedQ1, setSelectedQ1] = useState("");
    const [selectedQ2, setSelectedQ2] = useState("");
    const [selectedQ3, setSelectedQ3] = useState("");
    const [selectedQ4, setSelectedQ4] = useState("");
    const [selectedQ5, setSelectedQ5] = useState("");
    const [valueOfQuestion, setValueOfQuestion] = useState(0);
    const [textValueOfQuestion, setTextValueOfQuestion] = useState("");
    const [isLoadingSendActivity, setIsLoadingSendActivity] = useState(false);
    const [dataQuery, setDataQuery] = useState(null);

    useEffect(() => {
        setValueOfQuestion(note);
        switch (parseInt(note)) {
            case 2:
                setTextValueOfQuestion("Fácil");
                break;
            case 3:
                setTextValueOfQuestion("Médio");
                break;
            case 5:
                setTextValueOfQuestion("Difícil");
                break;
            default:
                break;
        }
    }, []);

    const uploadQueries = async () => {

        const data = {
            questao1: selectedQ1,
            questao2: selectedQ2,
            questao3: selectedQ3,
            questao4: selectedQ4,
            questao5: selectedQ5
        };

        setIsLoadingSendActivity(true);

        console.log(JSON.stringify(valueOfQuestion))

        const response = await AiCorrigeApi.uploadQueries(data, date, JSON.stringify(valueOfQuestion), title);

        setIsLoadingSendActivity(false);

        if(!response.r){
            typeof response.data.msg === Array? toast.error(response.data.msg.join("\n")):toast.error(response.data.msg);

            return
        };

        console.log(response);

        const dataQuery = response.data;

        setDataQuery(dataQuery.query);

        getPropsOfUser();
        toast.success(response.data.msg);
    };
    
    return(
        <>
            <Segment textAlign="left">
                <Header size="small" 
                content={title.charAt(0).toUpperCase().replaceAll("_", " ") + title.slice(1).replaceAll("_", " ")} 
                subheader={`${moment(date).format("DD/MM/YYYY")} - ${textValueOfQuestion} - cada questão vale ${valueOfQuestion}`} 
                />
                <Divider />
                <Container textAlign="left" fluid>{summary}</Container>
                <Divider />
                {
                    (question1 != null && question2 != null && question3 != null && question4 != null && question5 != null) &&
                    <List>
                        <List.Item>
                            <div className="info-question-new">1 - {question1.pergunta}</div>
                            <List.List>
                                <List.Item>A - <Checkbox onClick={() => setSelectedQ1("A")} checked={selectedQ1 == "A"} label={question1.A} /></List.Item>
                                <List.Item>B - <Checkbox onClick={() => setSelectedQ1("B")} checked={selectedQ1 == "B"} label={question1.B} /></List.Item>
                                <List.Item>C - <Checkbox onClick={() => setSelectedQ1("C")} checked={selectedQ1 == "C"} label={question1.C} /></List.Item>
                                <List.Item>D - <Checkbox onClick={() => setSelectedQ1("D")} checked={selectedQ1 == "D"} label={question1.D} /></List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            <div className="info-question-new">2 - {question2.pergunta}</div>
                            <List.List>
                                <List.Item>A - <Checkbox onClick={() => setSelectedQ2("A")} checked={selectedQ2 == "A"} label={question2.A} /></List.Item>
                                <List.Item>B - <Checkbox onClick={() => setSelectedQ2("B")} checked={selectedQ2 == "B"} label={question2.B} /></List.Item>
                                <List.Item>C - <Checkbox onClick={() => setSelectedQ2("C")} checked={selectedQ2 == "C"} label={question2.C} /></List.Item>
                                <List.Item>D - <Checkbox onClick={() => setSelectedQ2("D")} checked={selectedQ2 == "D"} label={question2.D} /></List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            <div className="info-question-new">3 - {question3.pergunta}</div>
                            <List.List>
                                <List.Item>A - <Checkbox onClick={() => setSelectedQ3("A")} checked={selectedQ3 == "A"} label={question3.A} /></List.Item>
                                <List.Item>B - <Checkbox onClick={() => setSelectedQ3("B")} checked={selectedQ3 == "B"} label={question3.B} /></List.Item>
                                <List.Item>C - <Checkbox onClick={() => setSelectedQ3("C")} checked={selectedQ3 == "C"} label={question3.C} /></List.Item>
                                <List.Item>D - <Checkbox onClick={() => setSelectedQ3("D")} checked={selectedQ3 == "D"} label={question3.D} /></List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            <div className="info-question-new">4 - {question4.pergunta}</div>
                            <List.List>
                                <List.Item>A - <Checkbox onClick={() => setSelectedQ4("A")} checked={selectedQ4 == "A"} label={question4.A} /></List.Item>
                                <List.Item>B - <Checkbox onClick={() => setSelectedQ4("B")} checked={selectedQ4 == "B"} label={question4.B} /></List.Item>
                                <List.Item>C - <Checkbox onClick={() => setSelectedQ4("C")} checked={selectedQ4 == "C"} label={question4.C} /></List.Item>
                                <List.Item>D - <Checkbox onClick={() => setSelectedQ4("D")} checked={selectedQ4 == "D"} label={question4.D} /></List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            <div className="info-question-new">5 - {question5.pergunta}</div>
                            <List.List>
                                <List.Item>A - <Checkbox onClick={() => setSelectedQ5("A")} checked={selectedQ5 == "A"} label={question5.A} /></List.Item>
                                <List.Item>B - <Checkbox onClick={() => setSelectedQ5("B")} checked={selectedQ5 == "B"} label={question5.B} /></List.Item>
                                <List.Item>C - <Checkbox onClick={() => setSelectedQ5("C")} checked={selectedQ5 == "C"} label={question5.C} /></List.Item>
                                <List.Item>D - <Checkbox onClick={() => setSelectedQ5("D")} checked={selectedQ5 == "D"} label={question5.D} /></List.Item>
                            </List.List>
                        </List.Item>
                    </List>
                }
                <Divider />
                <Button className="margin-top-mini" onClick={() => {
                    setCurrentActivity(null);
                }} color="blue" content="Responder Depois" />
                <Button className="margin-top-mini" onClick={uploadQueries} loading={isLoadingSendActivity} color="green" content="Enviar respostas" />
            </Segment>

            <Modal
            onClose={() => {
                setDataQuery(null);
                setCurrentActivity(null);
            }}
            open={dataQuery != null}
            >
            <Header content="Resultado:" />
            <Modal.Content>
                {
                    dataQuery != null &&
                    <ViewActivityRes
                    note={dataQuery.note}
                    question1={dataQuery.query.questao1}
                    question2={dataQuery.query.questao2}
                    question3={dataQuery.query.questao3}
                    question4={dataQuery.query.questao4}
                    question5={dataQuery.query.questao5}
                    summary={dataQuery.query.resumo}
                    noteObtained={dataQuery.totalNote}
    
                    />
                }
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' onClick={() => {
                    setDataQuery(null);
                    setCurrentActivity(null);
                }}>
                    Fechar
                </Button>
            </Modal.Actions>
            </Modal>
        </>
    );
};

export default CreateActivity;