import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FormWrapper } from './registerForm.styles';

function RegisterForm() {
  return (
    <FormWrapper>
        <h1>Registration Page</h1>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Button variant="success" type="submit">
        Submit
      </Button>
      <div style={{marginTop: "30px"}}>Already have an account? <a href='/login'>Login here</a></div>
    </FormWrapper>
  );
}

export default RegisterForm;