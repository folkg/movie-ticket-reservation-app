import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ProtectedRoute, AnyonymousRoute } from "./routes/Routes";
import { MovieAPIProvider } from "./contexts/movie-api-provider";
import Navbar from "./components/navbar/navbar.component";
import CancelPage from "./pages/cancelpage/cancelpage.page";
import LoginPage from "./pages/loginpage/loginpage.page";
import RegisterPage from "./pages/registerpage/registerpage.page";
import MoviesPage from "./pages/moviespage/moviespage.page";
import NoPage from "./pages/404page/404page.page";
import HomePage from "./pages/homepage/homepage.page";
import TicketPage from "./pages/ticketpage/ticketpage.page";
import ProfilePage from "./pages/profilepage/profilepage.page";


function App() {
  return (
    <div className="App">
      <MovieAPIProvider>
        <Navbar />
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route exact path="/movies">
              <MoviesPage />
            </Route>
            <Route exact path="/cancel">
              <CancelPage />
            </Route>
            <Route exact path="/ticket/:ticket_id">
              <TicketPage />
            </Route>
            <AnyonymousRoute exact path="/register">
              <RegisterPage />
            </AnyonymousRoute>
            <AnyonymousRoute exact path="/login">
              <LoginPage />
            </AnyonymousRoute>
            <ProtectedRoute exact path="/profile">
              <ProfilePage />
            </ProtectedRoute>
            <Route path="*">
              <NoPage />
            </Route>
          </Switch>
        </BrowserRouter>
      </MovieAPIProvider>
    </div>
  );
}

export default App;
