import React, { useEffect, useState } from "react";
import { Button, Container, Divider, Grid, Header, Icon, Image, Label, List, Message, Segment } from "semantic-ui-react";
import logo from '../img/logo.png';

const ViewActivityRes = ({
note = 0,
summary = "Undefined", 
question1 = null,
question2 = null, 
question3 = null, 
question4 = null, 
question5 = null,
noteObtained = 0,
setViewMoreDetails
}) => {

    const [valueOfQuestion, setValueOfQuestion] = useState(0);
    const [textValueOfQuestion, setTextValueOfQuestion] = useState("");

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

    return(
        <>
            <Segment size="mini">
                <Header size="small" content={`Valor de cada questão: ${valueOfQuestion}`} subheader={`Nível: ${textValueOfQuestion}`}/>
                <Divider />
                <Container>{summary}</Container>
                <Divider />
                {
                    (question1 != null && question2 != null && question3 != null && question4 != null && question5 != null) &&
                    <List>
                        <List.Item>
                            <Segment size="mini" color={question1.alternativa_marcada === question1.alternativa_correta? "green":"red"}>
                                <div className="info-question">1 - {question1.pergunta}</div>
                                <div className="info-question-correct">
                                    Alternativa correta: {question1.alternativa_correta}
                                </div>
                                <List.List>
                                    <List.Item className={
                                        question1.alternativa_marcada === "A"?
                                        question1.alternativa_marcada === question1.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>A - {question1.A}</List.Item>
                                    <List.Item className={
                                        question1.alternativa_marcada === "B"?
                                        question1.alternativa_marcada === question1.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>B - {question1.B}</List.Item>
                                    <List.Item className={
                                        question1.alternativa_marcada === "C"?
                                        question1.alternativa_marcada === question1.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>C - {question1.C}</List.Item>
                                    <List.Item className={
                                        question1.alternativa_marcada === "D"?
                                        question1.alternativa_marcada === question1.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>D - {question1.D}</List.Item>
                                </List.List>
                                <Divider />
                                <Header size="tiny" textAlign="left"
                                image={<Image src={logo} size="mini" />} 
                                content="Explicação da AI:"
                                />
                                <br/>
                                <Container fluid textAlign="left" content={question1.motivo_alternativa || "-"} />
                            </Segment>
                        </List.Item>
                        <List.Item>
                            <Segment size="mini" color={question2.alternativa_marcada === question2.alternativa_correta? "green":"red"}>
                                <div className="info-question">2 - {question2.pergunta}</div>
                                <div className="info-question-correct">
                                    Alternativa correta: {question2.alternativa_correta}
                                </div>
                                <List.List>
                                    <List.Item className={
                                        question2.alternativa_marcada === "A"?
                                        question2.alternativa_marcada === question2.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>A - {question2.A}</List.Item>
                                    <List.Item className={
                                        question2.alternativa_marcada === "B"?
                                        question2.alternativa_marcada === question2.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>B - {question2.B}</List.Item>
                                    <List.Item className={
                                        question2.alternativa_marcada === "C"?
                                        question2.alternativa_marcada === question2.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>C - {question2.C}</List.Item>
                                    <List.Item className={
                                        question2.alternativa_marcada === "D"?
                                        question2.alternativa_marcada === question2.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>D - {question2.D}</List.Item>
                                </List.List>
                                <Divider />
                                <Header size="tiny" 
                                image={<Image src={logo} size="mini" />} 
                                content="Explicação da AI:"
                                />
                                <br/>
                                <Container fluid textAlign="left" content={question2.motivo_alternativa || "-"} />
                            </Segment>
                        </List.Item>
                        <List.Item>
                            <Segment size="mini" color={question3.alternativa_marcada === question3.alternativa_correta? "green":"red"}>
                                <div className="info-question">3 - {question3.pergunta}</div>
                                <div className="info-question-correct">
                                    Alternativa correta: {question3.alternativa_correta}
                                </div>
                                <List.List>
                                    <List.Item className={
                                        question3.alternativa_marcada === "A"?
                                        question3.alternativa_marcada === question3.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>A - {question3.A}</List.Item>
                                    <List.Item className={
                                        question3.alternativa_marcada === "B"?
                                        question3.alternativa_marcada === question3.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>B - {question3.B}</List.Item>
                                    <List.Item className={
                                        question3.alternativa_marcada === "C"?
                                        question3.alternativa_marcada === question3.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>C - {question3.C}</List.Item>
                                    <List.Item className={
                                        question3.alternativa_marcada === "D"?
                                        question3.alternativa_marcada === question3.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>D - {question3.D}</List.Item>
                                </List.List>
                                <Divider />
                                <Header size="tiny" 
                                image={<Image src={logo} size="mini" />} 
                                content="Explicação da AI:"
                                />
                                <br/>
                                <Container fluid textAlign="left" content={question3.motivo_alternativa || "-"} />
                            </Segment>
                        </List.Item>
                        <List.Item>
                            <Segment size="mini" color={question4.alternativa_marcada === question4.alternativa_correta? "green":"red"}>
                                <div className="info-question">4 - {question4.pergunta}</div>
                                <div className="info-question-correct">
                                    Alternativa correta: {question4.alternativa_correta}
                                </div>
                                <List.List>
                                    <List.Item className={
                                        question4.alternativa_marcada === "A"?
                                        question4.alternativa_marcada === question4.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>A - {question4.A}</List.Item>
                                    <List.Item className={
                                        question4.alternativa_marcada === "B"?
                                        question4.alternativa_marcada === question4.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>B - {question4.B}</List.Item>
                                    <List.Item className={
                                        question4.alternativa_marcada === "C"?
                                        question4.alternativa_marcada === question4.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>C - {question4.C}</List.Item>
                                    <List.Item className={
                                        question4.alternativa_marcada === "D"?
                                        question4.alternativa_marcada === question4.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>D - {question4.D}</List.Item>
                                </List.List>
                                <Divider />
                                <Header size="tiny" 
                                image={<Image src={logo} size="mini" />} 
                                content="Explicação da AI:"
                                />
                                <br/>
                                <Container fluid textAlign="left" content={question4.motivo_alternativa || "-"} />
                            </Segment>
                        </List.Item>
                        <List.Item>
                            <Segment size="mini" color={question5.alternativa_marcada === question5.alternativa_correta? "green":"red"}>
                                <div className="info-question">5 - {question5.pergunta}</div>
                                <div className="info-question-correct">
                                    Alternativa correta: {question5.alternativa_correta}
                                </div>
                                <List.List>
                                    <List.Item className={
                                        question5.alternativa_marcada === "A"?
                                        question5.alternativa_marcada === question5.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>A - {question5.A}</List.Item>
                                    <List.Item className={
                                        question5.alternativa_marcada === "B"?
                                        question5.alternativa_marcada === question5.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>B - {question5.B}</List.Item>
                                    <List.Item className={
                                        question5.alternativa_marcada === "C"?
                                        question5.alternativa_marcada === question5.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>C - {question5.C}</List.Item>
                                    <List.Item className={
                                        question5.alternativa_marcada === "D"?
                                        question5.alternativa_marcada === question5.alternativa_correta?
                                        "correct-question":"wrong-question":""
                                    }>D - {question5.D}</List.Item>
                                </List.List>
                                <Divider />
                                <Header size="tiny" 
                                image={<Image src={logo} size="mini" />} 
                                content="Explicação da AI:"
                                />
                                <br/>
                                <Container fluid textAlign="left" content={question5.motivo_alternativa || "-"} />
                            </Segment>
                        </List.Item>
                    </List>
                } <Message color="blue" content={`Nota obtida: ${noteObtained}`} />
            </Segment>
        </>
    );
};

export default ViewActivityRes;