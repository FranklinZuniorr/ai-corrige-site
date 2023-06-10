import { useDispatch } from "react-redux";
import AiCorrigeApi, { setTokenJwtAxios } from "../services/AiCorrigeApi";
import store, { setAccessToken, setIsLoggedUser, setRefreshToken, setUserData } from "../store";
import { KEY_COOKIE_ACCESS, KEY_COOKIE_REFRESH } from "./constants";
import Cookies from "js-cookie";


export const verifyUser = async () => {
    const accessToken = Cookies.get(KEY_COOKIE_ACCESS);
    const refreshToken = Cookies.get(KEY_COOKIE_REFRESH);

    if(accessToken){
      const response = await AiCorrigeApi.verifyAccessToken(accessToken);

      if(!response.r){
        return
      }else{
        const data = response.data.user;
        store.dispatch(setIsLoggedUser(true));
        store.dispatch(setIsLoggedUser(true));
        store.dispatch(setAccessToken(accessToken));
        store.dispatch(setRefreshToken(refreshToken));
        store.dispatch(setUserData(data));
        setTokenJwtAxios(accessToken);
      };

      console.log(response);
    }else{
        store.dispatch(setIsLoggedUser(false));
    }

  };