import React, {useContext} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from './selectMovie.styles';
import { MovieAPIContext } from '../../contexts/movie-api-provider';

const SelectMovie = ({nextStep, handleChange, values}) =>{
    const [data, setData] = React.useState({});
    // const [movies, setMovies] = React.useState([]);
    const { isLoggedIn } = useContext(MovieAPIContext);

    React.useEffect(() => {
        (async () => {
          const response = await fetch("http://localhost:5000/api/v1/movies");
          setData(await response.json());
        //   setMovies(await Array.from(data.data));
        //   console.log(movies);
        })();
      }, []);
    
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
        <h1>Select Movie</h1>
        <Form>
            {isLoggedIn? 
                <Form.Select onChange={handleChange('moviename')} defaultValue = {values.moviename}>
                    <option>Open this select menu</option>
                    <option value="M_001">Citizen Kane</option>
                    <option value="M_002">Titanic</option>
                    <option value="M_003">Demon Slayer</option>
                    <option value="M_004">The Good, The Bad, And The Ugly</option>
                    <option value="M_005">Citizen Kane 2</option>

                </Form.Select>
                :
                <Form.Select onChange={handleChange('moviename')} defaultValue = {values.moviename}>
                    <option>Open this select menu</option>
                    <option value="M_001">Citizen Kane</option>
                    <option value="M_002">Titanic</option>
                    <option value="M_003">Demon Slayer</option>
                    <option value="M_004">The Good, The Bad, And The Ugly</option>
                </Form.Select>
            }

            <Button onClick={Continue} style = {{float: "right", marginTop: "5vh"}}>
                Next
            </Button>   
        </Form>
 
    </Container>)
}

export default SelectMovie;