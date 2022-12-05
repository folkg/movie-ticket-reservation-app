import React, { useContext } from 'react';
import { Screen,Seat, SeatsContainer, Container} from "./selectSeat.styles";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { MovieAPIContext } from "../../contexts/movie-api-provider";

const SelectSeat = ({prevStep, nextStep, handleChange, values}) =>{
    const { getAllSeats } = useContext(MovieAPIContext);
    const [data, setData] = React.useState(null);

    const Continue = e => {
        e.preventDefault();
        console.log(values.seats);
        nextStep();
    }

    const Previous = e => {
        e.preventDefault();
        prevStep();
    }

    React.useEffect(() => {
        async function fetchSeats() {
          setData(await getAllSeats());
        }
        fetchSeats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    return (
        <Container>
            <div style={{textAlign: "center"}}>Section A</div>
            <SeatsContainer>
            {
                [...Array(10)].map((e, i) => <Seat key={i}>{i+1}</Seat>)
            }
            </SeatsContainer>
            
            <SeatsContainer>

            <div style={{marginLeft: "10vw"}}>Section B</div>
            <div style={{marginRight: "10vw"}}>Section C</div>

            </SeatsContainer>

            <SeatsContainer>

                {
                    [...Array(4)].map((e, i) => <Seat key={i}>{i+1}</Seat>)
                }
                    <Seat style={{border:"None"}}></Seat>
                    <Seat style={{border:"None"}}></Seat>
                {
                    [...Array(4)].map((e, i) => <Seat key={i}>{i+1}</Seat>)
                }

            </SeatsContainer>

            <div style={{textAlign: "center"}}>Section D</div>
            <SeatsContainer>
            {
                [...Array(10)].map((e, i) => <Seat key={i}>{i+1}</Seat>)
            }
            </SeatsContainer>
            
        
            <Screen>Screen</Screen>

            {data != null && (
            <Form>
                <Form.Select
                    onChange={handleChange("seats")}
                    defaultValue={values.seats}
                >
                    <option value="">Open this select menu to select your seat</option>
                    {data.map((s) => {
                        if (s.showing_id === values.showtime && s.is_available === true)
                            return <option value={s.seat_id}>{s.seat_label}</option>
                    })}
                </Form.Select>
            </Form>
            )}

            <Button onClick={Previous} style = {{marginTop: "5vh"}}>
                Back
            </Button>
            <Button onClick={Continue} style = {{float: "right", marginTop: "5vh"}}>
                Next
            </Button>
        </Container>)
}

export default SelectSeat;