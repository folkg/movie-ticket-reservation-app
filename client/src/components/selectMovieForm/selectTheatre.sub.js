import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container } from "./selectTheatre.styles";
import { MovieAPIContext } from "../../contexts/movie-api-provider";

const SelectTheatre = ({ prevStep, nextStep, handleChange, values }) => {
  const { getOneMovie } = useContext(MovieAPIContext);
  const [data, setData] = React.useState(null);
  var showings;
  const Continue = (e) => {
    e.preventDefault();
    if (values.theatrename === "") {
      alert("you have to select a theatre");
      return;
    }
    nextStep();
  };

  const Previous = (e) => {
    e.preventDefault();
    prevStep();
  };

  React.useEffect(() => {
    async function fetchTickets() {
      setData(await getOneMovie(values.moviename));
    }
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <h1>Select Theatre</h1>
      {data != null && (
        <Form>
          <Form.Select
            onChange={handleChange("theatrename")}
            defaultValue={values.theatrename}
          >
            <option value="">Open this select menu</option>
            {data.showings.map((s) => (
              <option value={s.theatre_id}>{s.theatre_name}</option>
            ))}

            {/* <option value="One">One</option>
          <option value="Two">Two</option>
          <option value="Three">Three</option> */}
          </Form.Select>
          <Button onClick={Previous} style={{ marginTop: "5vh" }}>
            Back
          </Button>
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

export default SelectTheatre;
