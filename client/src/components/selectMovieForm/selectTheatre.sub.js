import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from './selectTheatre.styles';

const SelectTheatre = ({prevStep, nextStep, handleChange, values}) =>{
    const Continue = e => {
        e.preventDefault();
        nextStep();
    }

    const Previous = e => {
        e.preventDefault();
        prevStep();
    }
    

    return (
        <Container>
            <Form>
                <Form.Select onChange={handleChange('theatrename')} defaultValue = {values.theatrename}>
                    <option>Open this select menu</option>
                    <option value="One">One</option>
                    <option value="Two">Two</option>
                    <option value="Three">Three</option>
                </Form.Select>
                <Button onClick={Previous} style = {{marginTop: "5vh"}}>
                    Back
                </Button>
                <Button onClick={Continue} style = {{float: "right", marginTop: "5vh"}}>
                    Next
                </Button>
            </Form>
        </Container>)
}

export default SelectTheatre;