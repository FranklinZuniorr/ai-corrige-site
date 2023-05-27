import axios from "axios";

const AxiosAiCorrige = axios.create({

    baseURL: "https://api-ai-corrige.herokuapp.com",

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
            
        } catch (error) {
            
        }
    };
};

export default AiCorrigeApi;