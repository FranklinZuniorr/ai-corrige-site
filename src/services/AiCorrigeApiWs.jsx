import store, { setResAiCurrent } from "../store";

export const startWs = (data) => {
    const socket = new WebSocket(`ws://ai-corrige-ws-9bf366fa3a3c.herokuapp.com/?userId=${data._id}`);
    
    // Evento de conexão estabelecida
    socket.onopen = () => {
      console.log('Conexão estabelecida');
    
      // Envie uma mensagem para o servidor
      socket.send(data);
    };
    
    // Evento de recebimento de mensagem do servidor
    socket.onmessage = (event) => {
      /* console.log('Mensagem recebida do servidor ws:', event.data); */
      const data = JSON.parse(event.data);
      
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
        console.log('Conexão fechada');
        /* window.location.reload(); */
    };
    
    // Evento de erro na conexão
    socket.onerror = (error) => {
      console.error('Erro na conexão WebSocket:', error);
    };
};