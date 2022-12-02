import React, { createContext, useEffect } from "react";
import { useSessionStorageState } from "../hooks/useSessionStorageState";

const API_URL = "http://localhost:5000/api/v1/";

export const MovieAPIContext = createContext();

export function MovieAPIProvider(props) {
  // Create a token and studentInfo for the user and save in session storage. Default value is null.
  const [jwt, setJwt] = useSessionStorageState("token", null);
  const [userInfo, setUserInfo] = useSessionStorageState("user", null);

  // [] option will behave like componentDidMount and run only once at startup
  useEffect(() => {
    // Create an interceptor that looks for a new JWT. Refresh token if required.
    //TODO: Convert to fetch
    // axios.interceptors.response.use((res) => {
    //   const newToken = res.headers["X-New-Token"];
    //   if (newToken) {
    //     // set the new JWT in state and sync to localstorage
    //     setJwt(newToken);
    //   }
    //   return res;
    // });
  }, []);

  async function exampleFetchWithJWT() {
    fetch(API_URL, {
      method: "POST",
      headers: new Headers({
        Authorization: `JWT ${jwt}`,
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body: "test",
    });
  }

  async function login(email, password) {
    // Send credentials to server and save the token from the response
    try {
      const response = await fetch(API_URL + "users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const body = await response.json();
      if (body.status === "success") {
        // Set the token in session storage for use in later API calls
        const token = body.data;
        setJwt(token);
        return true;
      } else return body.message;
    } catch (e) {
      console.log(e);
      return "Server communication error";
    }
  }

  const isTokenValid = () => {
    if (jwt == null) {
      return false;
    } else {
      try {
        const expiryDate = JSON.parse(window.atob(jwt.split(".")[1]));
        if (expiryDate.exp * 1000 < Date.now()) {
          logout();
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
      return true;
    }
  };

  function logout() {
    setJwt("");
  }

  async function register(email, password, firstName, lastName) {
    // Send credentials to server and save the token from the response
    try {
      const response = await fetch(API_URL + "register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });
      const body = await response.json();

      if (body.status === "success") return true;
      else return body.message;
    } catch (e) {
      console.log(e);
      return "Server communication error";
    }
  }

  return (
    <MovieAPIContext.Provider
      value={{
        login,
        isTokenValid,
        jwt,
        logout,
        register,
      }}
    >
      {props.children}
    </MovieAPIContext.Provider>
  );
}
