import React, { useState, useContext } from "react";
import "./loginForm.css";
import Alert from "react-bootstrap/Alert";
import { MovieAPIContext } from "../../contexts/movie-api-provider";

function LoginForm() {
  const { login } = useContext(MovieAPIContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loginResult, setLoginResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await login(email, password);
    setLoginResult(result);
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Login</h3>
          {loginResult != null && loginResult !== true && (
            <div className="d-grid mt-3">
              <Alert variant="danger">{loginResult}</Alert>
            </div>
          )}
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <div style={{ marginTop: "1rem" }}>
            Don't have an account? <a href="/register">register here</a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
