import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from './selectTheatre.styles';

const SelectTheatre = ({prevStep, nextStep, handleChange, values}) =>{
    const [data, setData] = React.useState({});
    var showings;
    const Continue = e => {
        e.preventDefault();
        if (values.theatrename === ""){
            alert("you have to select a theatre");
            return;
        }
        nextStep();
    }

    const Previous = e => {
        e.preventDefault();
        prevStep();
    }
    React.useEffect(() => {
        (async () => {
          const response = await fetch("http://localhost:5000/api/v1/movies/" + values.moviename);
          setData(await response.json());
            // console.log(data.data);
        //   showings = data.showings;
        //   console.log(showings);
            console.log(data.data);
        })();
      }, []);
    
    return (
        <Container>
            <h1>Select Theatre</h1>
            <div>
                {JSON.stringify(data.data)}
            </div>
            <Form>
                <Form.Select onChange={handleChange('theatrename')} defaultValue = {values.theatrename}>
                    <option value = "">Open this select menu</option>
                    {/* {
                        Array.from(data.showings).map(s => (
                            <option value={s.theatre_id}>{s.theatre_name}</option>
                        ))
                    } */}

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