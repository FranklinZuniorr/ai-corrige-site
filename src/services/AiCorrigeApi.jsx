import axios from "axios";
import { verifyReqTokenExpiration } from "../utils/FnUtils";
import { toast } from "react-hot-toast";
import { KEY_COOKIE_ACCESS, KEY_COOKIE_REFRESH, TEMPLATE_QUERY_AMQP, TEMPLATE_UPLOAD_QUERY } from "../utils/constants";
import Cookies from "js-cookie";
import { isArray } from "lodash";

const AxiosAiCorrige = axios.create({

    baseURL: "https://ai-corrige.herokuapp.com",

});

const onResponse = (response) => {
    const filter = response.data;
    if(isArray(filter.data.msg)){
        filter.msg = filter.msg.join("\n");
    };
    return response;
  };
  
  const onError = (error) => {
    if (error.response) {
        if(isArray(error.response.data.data.msg)){
            const filter = error.response.data;
            filter.data.msg = filter.data.msg.join("\n");
        };
    };
    return Promise.reject(error);
  };
  
  AxiosAiCorrige.interceptors.response.use(onResponse, onError);

export const setTokenJwtAxios = (token) => {
    AxiosAiCorrige.defaults.headers.common['accessToken'] = token;
};

class AiCorrigeApi{
    static newUser = async (username, email, password) => {
        try {

            const data = {
                username,
                email,
                password
            };

            const response = await AxiosAiCorrige.post(`new-user`, data);

            return response.data;
            
        } catch (error) {
            return error.response.data;
        }
    };

    static loginUser = async (email, password) => {
        try {

            const data = {
                email,
                password
            };

            const response = await AxiosAiCorrige.post(`login`, data);

            return response.data;
            
        } catch (error) {
            return error.response.data;
        }
    };

    static verifyAccessToken = async (accessToken) => {
        try {

            const data = {
                accessToken
            };

            const response = await AxiosAiCorrige.post(`access-token`, data);

            return response.data;
            
        } catch (error) {
            return verifyReqTokenExpiration({accessToken}, error, "BODY", "verifyAccessToken");
        }
    };

    static verifyRefreshToken = async (refreshToken) => {
        try {

            const data = {
                refreshToken
            };

            const response = await AxiosAiCorrige.post(`refresh-token`, data);

            return response.data;
            
        } catch (error) {
            return error.response.data;
        }
    };

    static logoutUser = async () => {
        try {
            
            const response = await AxiosAiCorrige.post(`logout`);

            return response.data;

        } catch (error) {
            return verifyReqTokenExpiration(null, error, "BODY", "logoutUser");
            
        }
    };

    static deleteUser = async () => {
        try {

            const response = await AxiosAiCorrige.delete(`delete-user`);

            return response.data;
            
        } catch (error) {
            return verifyReqTokenExpiration(null, error, "BODY", "deleteUser");
        }
    };

    static forgetPassword = async (email) => {
        try {

            const data = {
                email
            };

            const response = await AxiosAiCorrige.post(`forget-password`, data);

            return response.data;
            
        } catch (error) {
            return error.response.data;
        }
    };

    static editUser = async (username, email, password) => {
        try {

            const data = {
                username,
                email,
                password
            };

            const response = await AxiosAiCorrige.patch(`edit-user`, data);

            return response.data;
            
        } catch (error) {
            return verifyReqTokenExpiration({username, email, password}, error, "BODY", "editUser");
        }
    };

    static uploadImage = async (file, code) => {
        try {

            const formData = new FormData();
            formData.append('file', file);

            const response = await AxiosAiCorrige.post(`upload-image?code=${code}`, formData);

            return response.data;
            
        } catch (error) {
            return verifyReqTokenExpiration({file, code}, error, "QUERY", "uploadImage");
        }
    };

    static stripeCheckout = async () => {
        try {

            const response = await AxiosAiCorrige.post(`stripe/create-checkout-session`);

            return response.data;
            
        } catch (error) {
            return verifyReqTokenExpiration(null, error, "BODY", "stripeCheckout");
        }
    };

    static aiJsonAmqp = async (title, msg, difficulty, note) => {
        try {

            const data = {
                ...TEMPLATE_QUERY_AMQP, 
                title: title, 
                msg: `Texto explicando sobre algum assunto aleatório de nível ${difficulty} referente a ${msg}`,
                note: note
            };

            /* console.log(data) */
            
            const response = await AxiosAiCorrige.post(`ai/json-amqp`, data);

            return response.data;

        } catch (error) {
            return verifyReqTokenExpiration({title, msg, difficulty, note}, error, "BODY", "aiJsonAmqp");
        }
    };

    static aiJsonAmqpCustom = async (title, msg) => {
        try {

            const data = {
                ...TEMPLATE_QUERY_AMQP, 
                title: title, 
                msg: `Texto detalhado explicando sobre algum assunto aleatório referente a ${msg.trim().toLowerCase()}`,
                note: 5
            };

            /* console.log(data) */
            
            const response = await AxiosAiCorrige.post(`ai/json-amqp`, data);

            return response.data;

        } catch (error) {
            return verifyReqTokenExpiration({title, msg}, error, "BODY", "aiJsonAmqpCustom");
        }
    };

    static uploadQueries = async (data, date, note, theme) => {
        try {

            const dataFilter = TEMPLATE_UPLOAD_QUERY;
            dataFilter.query.data = {...data};
            dataFilter.query.createdAt = date;
            dataFilter.note = note;
            dataFilter.theme = theme;

            const response = await AxiosAiCorrige.post('upload-queries', dataFilter);

            return response.data;
            
        } catch (error) {
            return verifyReqTokenExpiration({data, date, note, theme}, error, "BODY", "uploadQueries");
        }
    };

    static getTop10 = async (text) => {
        try {

            const response = await AxiosAiCorrige.get('get-top-10');

            return response.data;
            
        } catch (error) {
            return verifyReqTokenExpiration(null, error, "BODY", "getTop10");
        }
    };

    static setExternalUrl = async (link) => {
        try {
            
            const data = {
                externalUrl: link
            };

            const response = await AxiosAiCorrige.post('set-external-url', data);

            return response.data;
            
        } catch (error) {
            return verifyReqTokenExpiration({link}, error, "BODY", "setExternalUrl");
        }
    };

    static themes = async (page) => {
        try {

            const data = {
                page
            };

            const response = await AxiosAiCorrige.post('/themes', data);

            return response.data;
            
        } catch (error) {
            return verifyReqTokenExpiration({page}, error, "BODY", "themes");
        }
    };
};

export default AiCorrigeApi;

AxiosAiCorrige.interceptors.response.use(function (response) {
    return response;
}, function (error) {

    if (error.response) {
        const { response: { status, data } } = error;

        if (data.data) {
            const error = data.data.msg;

            if (error === 'Token inválido!' || error === 'RefreshTokenExpiredError!') {
                Cookies.set(KEY_COOKIE_ACCESS, "");
                Cookies.set(KEY_COOKIE_REFRESH, "");
                setTokenJwtAxios("");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            };
        };
    } else if (error.message === 'Network Error') {
        return {data: {r:false, data: {msg: '📡❗️ Sem conexão com o servidor'}}}
    };

    return Promise.reject(error);
});