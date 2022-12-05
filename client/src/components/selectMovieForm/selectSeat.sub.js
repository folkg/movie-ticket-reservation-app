import React from 'react';
import { Screen, Container} from "./selectSeat.styles";
import Button from "react-bootstrap/Button";


const SelectSeat = ({prevStep, nextStep, handleChange, values}) =>{
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
                <Screen></Screen>
                <Button onClick={Previous} style = {{marginTop: "5vh"}}>
                    Back
                </Button>
                <Button onClick={Continue} style = {{float: "right", marginTop: "5vh"}}>
                    Next
                </Button>
        </Container>)
}

export default SelectSeat;