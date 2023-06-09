import React, { useEffect, useState } from "react";
import { getParamsInQs, resetUrlSearchParam } from "../utils/FnUtils";
import { Button, Form, Grid, Header, Input, Message, Segment } from "semantic-ui-react";
import AiCorrigeApi, { setTokenJwtAxios } from "../services/AiCorrigeApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {

    // Area new password
    const [textUserPasswordNewPassword, setTextUserPasswordNewPassword] = useState("");
    const [isLoadingBtnNewPassword, setIsLoadingBtnNewPassword] = useState(false);
    const [showPasswordNewPassword, setShowPasswordNewPassword] = useState(true);
    const [isTokenOk, setIsTokenOk] = useState(false);
    // Area new password

    useEffect(() => {
        const execute = async () => {
            const data = getParamsInQs()

            if(data.r){
                const filter = data.data;
                const { accessToken } = filter;

                verifyAccessToken(accessToken);
            }
        };

        execute();
    }, []);

    const verifyAccessToken = async (accessToken) => {
        const response = await AiCorrigeApi.verifyAccessToken(accessToken);

        if(!response.r){
            toast.error(response.data.msg);
        }else{
            setIsTokenOk(true);
            setTokenJwtAxios(accessToken);
            resetUrlSearchParam({});
        };
    };

    const editUser = async () => {
        setIsLoadingBtnNewPassword(true);

        const response = await AiCorrigeApi.editUser(null, null, textUserPasswordNewPassword);

        if(!response.r){
            toast.error(response.data.msg);
        }else{
            setTokenJwtAxios("");
            toast.success(response.data.msg);
            window.location.pathname = "/";
        };

        setIsLoadingBtnNewPassword(false);
    };

    return(
        <>
            <div className="screen-forget-password">
                <div className="area-forget-password">
                    <Segment>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column>
                                    <Header size="small" content="Restaurar senha:"/>
                                    {
                                        isTokenOk?
                                        <Form onSubmit={() => editUser()}>
                                            <Form.Group widths={16}>
                                                <Form.Field width={16}>
                                                <label>Nova senha:</label>
                                                <Input
                                                type={showPasswordNewPassword? "text":"password"}
                                                value={textUserPasswordNewPassword}
                                                fluid
                                                size="mini"
                                                placeholder="Termo de cadastro..."
                                                onChange={(ev, data) => setTextUserPasswordNewPassword(data.value)}
                                                icon={{ name: showPasswordNewPassword? "eye":"eye slash", circular: true, link: true, onClick: () => setShowPasswordNewPassword(!showPasswordNewPassword)}}
                                                />
                                                </Form.Field>
                                            </Form.Group>

                                            <Button className="margin-top-min" type="submit" loading={isLoadingBtnNewPassword} size="mini" floated="right" color="green" content="Redefinir" />

                                        </Form>:<Message color="red" content="Redefinição indisponível!" />
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </div>
            </div>
        </>
    );
};

export default ForgetPassword;