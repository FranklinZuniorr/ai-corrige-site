import moment from "moment/moment";
import queryString from "query-string";
import AiCorrigeApi from "../services/AiCorrigeApi";
import Cookies from "js-cookie";
import { KEY_COOKIE_REFRESH } from "./constants";
import { toast } from "react-hot-toast";


export const setUrlSearchParam = (object) => {
    const url = new URL(window.location);
    Object.keys(object).forEach(key => {
        const value = JSON.stringify(object[key])
        if (key === "page" && value === "1") {
            return null;
        };
        if (value !== "" && value !== null && value !== "null") {
            url.searchParams.set(key, object[key]);
        };
    });
    window.history.pushState({}, '', url);
};

export const resetUrlSearchParam = (object) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams();
    Object.keys(object).forEach((key) => {
      const value = JSON.stringify(object[key]);
      if (value !== "" && value !== null && value !== "null") {
            params.set(key, object[key]);
      };
    });
    const newUrl = url.origin + url.pathname + "?" + params.toString();
    window.history.pushState({}, "", newUrl);
};

export const getParamsInQs = () => {
    const qs = queryString.parse(window.location.search);

    if(Object.keys(qs).length > 0){
        return {
            data: qs,
            r: true
        };
    }else{
        return {
            r: false
        };
    };
    
};

export const gerarObjetoCondicional = (objetoInicial, incremento) => {
    const data = {
        ...objetoInicial,
        ...incremento
    };

    const filtro = Object.keys(data).filter((key) => key != "" && key != undefined && key != null);
    var novoObjeto = {};

    filtro.forEach(item => {
        if(data[item] != "" && data[item] != undefined && data[item] != null || typeof data[item] == 'boolean'){
        novoObjeto = {...novoObjeto, [item]: data[item]}
        };
    
    });

    return novoObjeto;
};

export const pastValue = async () => {
    const clipboard = await navigator.clipboard.readText();
    return clipboard;
};

export const convertMoney = (value, isMoney, isNegative) => {
    if(!isMoney){
        value = JSON.stringify(value);
        value = value.replace(/\D/g, '');
        value = value / 100;
        value = value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

        if(isNegative && value != "R$ 0,00"){
            return `-${value}`
        };

        return value;
    }else{
        value = JSON.stringify(value);
        value = value.replace(/\D/g, '');
        value = parseInt(value)/100;

        if(isNegative && value != "R$ 0,00"){
            return value * (-1)
        };

        return value;
    };
};

export const obterPorcentagem = (realizado, total) => {

    if(total != undefined || total != null && realizado != undefined || realizado != null){
        if(total > realizado || realizado >= total && realizado != 0 && total != 0){
            const data = realizado/total;
            return `${parseInt(realizado/total*100)}%`;
        };
    };

    return "0%";
};

export const splitInCaracter = (string, caractere, start) => {
    return string.slice(start, string.indexOf(caractere));
};

export const setToIsoString = (date, valueToSub = 3) => {
   return moment(date).subtract(valueToSub, 'hours').toISOString().slice(0, -1) + "-03:00";
};

export const verifyReqTokenExpiration = async (data, error, type, fn) => {
    if(error == "AccessTokenExpiredError!"){
        const refreshToken = Cookies.get(KEY_COOKIE_REFRESH);
        const response = await AiCorrigeApi.verifyRefreshToken(refreshToken);

        console.log(response);

        if(!response.r){
            toast.error(response.data.msg);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }else{
            switch (type) {
                case "QUERY":
                    
                    break;
            
                default:
                    break;
            }
        };
    };
};