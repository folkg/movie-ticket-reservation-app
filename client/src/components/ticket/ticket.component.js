import React, { useContext, useState } from "react";
import { Button, Card, Alert } from "react-bootstrap";
import { MovieAPIContext } from "../../contexts/movie-api-provider";

function Ticket(props) {
  const { cancelTicketById } = useContext(MovieAPIContext);
  const {
    movie_name,
    ticket_id,
    theatre_name,
    show_time,
    seat_label,
    cost,
    is_credited,
  } = props.ticket;
  const [cancelResult, setCancelResult] = useState(null);
  const dateDisplayOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const canCancel = () => {
    // Add UTC OFFSET to compensate for Mountain Standard Time.
    const UTC_OFFSET = 7 * 3600 * 1000;
    const show_time_date = new Date(new Date(show_time) + UTC_OFFSET);
    const current_date = new Date();
    const difference = show_time_date.getTime() - current_date.getTime();
    const hours = difference / (1000 * 3600);
    let cancel;
    hours >= 72 ? (cancel = true) : (cancel = false);
    return cancel;
  };

  const dateString = () => {
    const date = new Date(show_time);
    return date.toLocaleDateString("en-US", dateDisplayOptions);
  };

  async function handleCancel(e) {
    const results = await cancelTicketById(ticket_id);
    setCancelResult(results);
  }
  return (
    <Card className="m-2">
      <Card.Body>
        <Card.Title>{movie_name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">#{ticket_id}</Card.Subtitle>
        <Card.Text style={{ whiteSpace: "pre-line" }}>
          {`Theatre: ${theatre_name}
          Showtime: ${dateString()}
          Seat: ${seat_label}
          Cost: $${cost}`}
        </Card.Text>
        {cancelResult === true ? (
          <Alert variant="success">Ticket was cancelled succesfully.</Alert>
        ) : (
          cancelResult != null && <Alert variant="danger">{cancelResult}</Alert>
        )}
        <Button
          variant="outline-danger"
          onClick={handleCancel}
          disabled={!canCancel() || is_credited}
        >
          Cancel Ticket
        </Button>
      </Card.Body>
      {is_credited === 1 && (
        <Card.Footer className="text-danger">Ticket Cancelled</Card.Footer>
      )}
      {is_credited === 0 && !canCancel() && (
        <Card.Footer className="text-muted">
          Ticket cannot be Cancelled within 72 Hours of Showing
        </Card.Footer>
      )}
    </Card>
  );
}

export default Ticket;
