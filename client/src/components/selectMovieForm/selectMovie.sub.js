import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container } from "./selectMovie.styles";
import { MovieAPIContext } from "../../contexts/movie-api-provider";

const SelectMovie = ({ nextStep, handleChange, values }) => {
  const [data, setData] = React.useState(null);
  // const [movies, setMovies] = React.useState([]);
  const { getAllMovies } = useContext(MovieAPIContext);

  //NOTE: getAllMovies function is using the Bearer jwt, so if they are logged in, the API will return all movies for logged in users or not. No need to check separately for users logged in here.
  React.useEffect(() => {
    async function fetchTickets() {
      setData(await getAllMovies());
    }
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Continue = (e) => {
    e.preventDefault();
    if (values.moviename === "") {
      alert("you have to select a movie");
      return;
    }
    nextStep();
  };

  return (
    <Container>
      <h1>Select Movie</h1>
      {data != null && (
        <Form>
          <Form.Select
            onChange={handleChange("moviename")}
            defaultValue={values.moviename}
          >
            {data.map((m) => (
              <option key={m.movie_id} value={m.movie_id}>
                {m.movie_name}
              </option>
            ))}
          </Form.Select>

          <Button
            onClick={Continue}
            style={{ float: "right", marginTop: "5vh" }}
          >
            Next
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default SelectMovie;
