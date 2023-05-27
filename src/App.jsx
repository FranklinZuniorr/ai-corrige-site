import './App.css';
import Login from './screens/login.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'

function App() {
  return (
    <>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route
              path={"/"}
              element={
                null
              }
            />
          </Routes>
        </BrowserRouter>
      </div>

      <Login/>
    </>
  );
}

export default App;
