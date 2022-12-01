import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Navbar from "./components/navbar/navbar.component";
import CancelPage from './pages/cancelpage/cancelpage.page';
import LoginPage from './pages/loginpage/loginpage.page';
import RegisterPage from './pages/registerpage/registerpage.page';
import MoviesPage from './pages/moviespage/moviespage.page';
import NoPage from './pages/404page/404page.page'; 
import HomePage from './pages/homepage/homepage.page';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <BrowserRouter>
        <Switch>
          <Route exact path = "/">
            <HomePage/>
          </Route>
          <Route exact path = "/movies">
            <MoviesPage/>
          </Route>
          <Route exact path = "/cancel">
            <CancelPage/>
          </Route>
          <Route exact path = "/register" >
            <RegisterPage/>
          </Route>
          <Route exact path  = "/login" >
            <LoginPage/>
          </Route>
          <Route path = "*">
            <NoPage/>
          </Route>
        </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;
