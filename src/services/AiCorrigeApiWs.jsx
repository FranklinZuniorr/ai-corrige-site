import Cookies from "js-cookie";
import store, { setResAiCurrent, setWsAnotherConnection } from "../store";
import { KEY_COOKIE_ACCESS, KEY_COOKIE_REFRESH } from "../utils/constants";
import { setTokenJwtAxios } from "./AiCorrigeApi";

export const startWs = (data) => {
    /* console.log(data) */
    const socket = new WebSocket(`wss://ai-corrige-ws-9bf366fa3a3c.herokuapp.com/?userId=${data._id}&token=${data.validToken}`);
    console.log(data.validToken)
    
    // Evento de conexão estabelecida
    socket.onopen = () => {
      /* console.log('Conexão estabelecida'); */
    
      // Envie uma mensagem para o servidor
      socket.send(data);
    };
    
    // Evento de recebimento de mensagem do servidor
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      data.type == "string" && console.log('Mensagem recebida do servidor ws:', data.content);
      
      if(data.type == "object"){
        switch (data.content.event) {
            case "open-ai-error":
                store.dispatch(setResAiCurrent(data.content));
                break;
            case "open-ai-ok":
                store.dispatch(setResAiCurrent(data.content));
                break;
            default:
                break;
        }
      }
    };
    
    // Evento de fechamento da conexão
    socket.onclose = () => {
        /* console.log('Conexão fechada'); */
        window.location.reload();
    };
    
    // Evento de erro na conexão
    socket.onerror = (error) => {
      console.error('Erro na conexão WebSocket:', error);
    };
};