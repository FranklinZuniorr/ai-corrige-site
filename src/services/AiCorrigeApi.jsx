import axios from "axios";

const AxiosAiCorrige = axios.create({

    baseURL: "https://ai-corrige.herokuapp.com",

});

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
            return error.response.data;
        }
    };

    static logoutUser = async () => {
        try {
            
            const response = await AxiosAiCorrige.post(`logout`);

            return response.data;

        } catch (error) {
            return error.response.data;
        }
    };

    static deleteUser = async () => {
        try {

            const response = await AxiosAiCorrige.delete(`delete-user`);

            return response.data;
            
        } catch (error) {
            return error.response.data;
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

            const response = await AxiosAiCorrige.put(`edit-user`, data);

            return response.data;
            
        } catch (error) {
            return error.response.data;
        }
    };
};

export default AiCorrigeApi;