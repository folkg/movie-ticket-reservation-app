import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from './selectShowtime.styles';
import { MovieAPIContext } from "../../contexts/movie-api-provider";

const SelectShowtime = ({prevStep, nextStep, handleChange, values}) =>{
    const { getOneMovie } = useContext(MovieAPIContext);
    const [data, setData] = React.useState(null);
    const Continue = e => {
        e.preventDefault();
        nextStep();
    }

    const Previous = e => {
        e.preventDefault();
        prevStep();
    }
    
    React.useEffect(() => {
        async function fetchTickets() {
          setData(await getOneMovie(values.moviename));
        }
        fetchTickets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    return (
        <Container>
            {data != null && (
            <>
                <h1>Select Showtime</h1>
                <Form>
                    <Form.Select onChange={handleChange('showtime')} defaultValue = {values.showtime}>
                        <option value="">Open this select menu</option>
                        {data.showings.map((s) => (
                        <option value={s.showing_id}>{s.show_time}</option>
                        ))}
                    </Form.Select>
                </Form>
            </>
            )
            }
            <Button onClick={Previous} style = {{marginTop: "5vh"}}>
                    Back
                </Button>
            <Button onClick={Continue} style = {{float: "right", marginTop: "5vh"}}>
                Next
            </Button>
        </Container>)
}

export default SelectShowtime;