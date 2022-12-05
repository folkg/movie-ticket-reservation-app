import React, { useContext } from "react";
import { MovieAPIContext } from "../contexts/movie-api-provider";
import { Redirect } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(MovieAPIContext);
  if (!isLoggedIn) {
    // user is not authenticated
    return <Redirect to="/login" />;
  }
  return children;
}

export function AnyonymousRoute({ children }) {
  const { isLoggedIn } = useContext(MovieAPIContext);
  if (isLoggedIn) {
    // user is not authenticated
    return <Redirect to="/profile" />;
  }
  return children;
}
