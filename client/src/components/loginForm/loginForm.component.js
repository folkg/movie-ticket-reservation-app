import React, { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FormWrapper, Error, Success } from "./loginForm.styles";
import { MovieAPIContext } from "../../contexts/movie-api-provider";

function LoginForm() {
  const { login, isLoggedIn } = useContext(MovieAPIContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loginResult, setLoginResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await login(email, password);
    // const result = await getAllUsers();
    // set login error status
    setLoginResult(result);
  }

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <h1>Login Page</h1>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password || ""}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      {loginResult === true ? (
        <Success>Login Successful</Success>
      ) : (
        loginResult && <Error>Error: {loginResult}</Error>
      )}
      <Button variant="primary" type="submit" disabled={isLoggedIn}>
        Submit
      </Button>
      {isLoggedIn && <Success>User is already logged in</Success>}
      <div style={{ marginTop: "30px" }}>
        Don't have an account? <a href="/register">register here</a>
      </div>
    </FormWrapper>
  );
}

export default LoginForm;
