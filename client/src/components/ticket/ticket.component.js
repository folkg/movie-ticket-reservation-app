import React from "react";
import { Button, Card } from "react-bootstrap";

function Ticket(props) {
  const {
    movie_name,
    theatre_name,
    show_time,
    seat_label,
    cost,
  } = props.ticket;

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

  async function handleClick(e) {}
  return (
    <Card className="p-2 m-2">
      <Card.Body>
        <Card.Title>{movie_name}</Card.Title>
        <Card.Text style={{ whiteSpace: "pre-line" }}>
          {`Theatre: ${theatre_name}
          Showtime: ${dateString()}
          Seat: ${seat_label}
          Cost: $${cost}`}
        </Card.Text>
        <Button
          variant="outline-danger"
          onClick={handleClick}
          disabled={!canCancel()}
        >
          Cancel Ticket
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Ticket;
