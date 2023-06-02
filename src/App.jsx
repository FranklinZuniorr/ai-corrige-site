import { Toaster, toast } from 'react-hot-toast';
import './App.css';
import Login from './screens/login.jsx';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'
import Cookies from 'js-cookie';
import { KEY_COOKIE_ACCESS, KEY_COOKIE_REFRESH } from './screens/constants';
import { useEffect } from 'react';
import AiCorrigeApi, { setTokenJwtAxios } from './services/AiCorrigeApi';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken, setIsLoggedUser, setRefreshToken, setUserData } from './store';
import Home from './screens/Home';

function App() {

  const dispatch = useDispatch();
  const access = useSelector(store => store.isLoggedUser);

  useEffect(() => {
    verifyCookie();
  }, []);

  const verifyCookie = async () => {
    const accessToken = Cookies.get(KEY_COOKIE_ACCESS);
    const refreshToken = Cookies.get(KEY_COOKIE_REFRESH);

    if(accessToken){
      const response = await AiCorrigeApi.verifyAccessToken(accessToken);

      if(!response.r){
        toast.error(response.data.msg);
      }else{
        const data = response.data.verify.user;
        dispatch(setIsLoggedUser(true));
        dispatch(setAccessToken(accessToken));
        dispatch(setRefreshToken(refreshToken));
        dispatch(setUserData(data));
        setTokenJwtAxios(accessToken);
      };

      console.log(response);
    }else{
      dispatch(setIsLoggedUser(false));
    }

  };

  return (
    <>
      <Toaster position="bottom-center" />
      {
        access?
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route
                path={"/"}
                element={
                  <Home/>
                }
              />
            </Routes>
          </BrowserRouter>
        </div>:
        <Login/>
      }

    </>
  );
}

export default App;
