import { Toaster, toast } from 'react-hot-toast';
import './App.css';
import Login from './screens/login.jsx';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'
import Cookies from 'js-cookie';
import { KEY_COOKIE_ACCESS, KEY_COOKIE_REFRESH } from './utils/constants';
import { useEffect, useState } from 'react';
import AiCorrigeApi, { setTokenJwtAxios } from './services/AiCorrigeApi';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken, setIsLoggedUser, setRefreshToken, setUserData } from './store';
import Home from './screens/Home';
import Menu from './components/Menu';
import ForgetPassword from './screens/ForgetPassword';

function App() {

  const dispatch = useDispatch();
  const access = useSelector(store => store.isLoggedUser);
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    verifyCookie();

    const execute = async () => {
      console.log(window.location.pathname)
      setPathname(window.location.pathname);
    };

    execute();
  }, []);

  const verifyCookie = async () => {
    const accessToken = Cookies.get(KEY_COOKIE_ACCESS);
    const refreshToken = Cookies.get(KEY_COOKIE_REFRESH);

    if(accessToken){
      const response = await AiCorrigeApi.verifyAccessToken(accessToken);

      if(!response.r){
        return
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
        <>
          {
            pathname == "/forget-password"? <ForgetPassword />:
            access?
            <>
              <Menu/>
              <BrowserRouter>
                <div className="App">
                  <Routes>
                      <Route path="/" element={<Home />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </>:<Login/>
          }
        </>
    </>
  );
}

export default App;
