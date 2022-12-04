import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from './selectMovie.styles';

const SelectMovie = ({nextStep, handleChange, values}) =>{
    const Continue = e => {
        e.preventDefault();
        if (values.moviename === ""){
            alert("you have to select a movie");
            return;
        }
        nextStep();
      }

    return (
    <Container>
        <Form>
            <Form.Select onChange={handleChange('moviename')} defaultValue = {values.moviename}>
                <option>Open this select menu</option>
                <option value="One">One</option>
                <option value="Two">Two</option>
                <option value="Three">Three</option>
            </Form.Select>
            <Button onClick={Continue} style = {{float: "right", marginTop: "5vh"}}>
                Next
            </Button>   
        </Form>
 
    </Container>)
}

export default SelectMovie;