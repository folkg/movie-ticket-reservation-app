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

  function canCancel() {
    // Add UTC OFFSET to compensate for Mountain Standard Time.
    const UTC_OFFSET = 7 * 3600 * 1000;
    const show_time_date = new Date(new Date(show_time) + UTC_OFFSET);
    const current_date = new Date();
    const difference = show_time_date.getTime() - current_date.getTime();
    const hours = difference / (1000 * 3600);
    let cancel;
    hours >= 72 ? (cancel = true) : (cancel = false);
    return cancel;
  }

  async function handleClick(e) {}
  return (
    <Card className="w-50 p-3 m-2">
      <Card.Body>
        <Card.Title>{movie_name}</Card.Title>
        <Card.Text>
          <p>Theatre: {theatre_name}</p>
          <p>Showtime: {show_time}</p>
          <p>Seat: {seat_label}</p>
          <p>Cost: {cost}</p>
        </Card.Text>
        <Button
          variant="outline-danger"
          onClick={handleClick}
          disabled={canCancel()}
        >
          Cancel Ticket
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Ticket;
