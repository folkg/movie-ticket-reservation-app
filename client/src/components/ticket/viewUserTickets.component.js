import React, { useContext, useState, useEffect } from "react";
import Ticket from "./ticket.component";
import { Container, Col, Card } from "react-bootstrap";
import { MovieAPIContext } from "../../contexts/movie-api-provider";

export default function viewUserTickets() {
  const { getTicketsForCurrentUser } = useContext(MovieAPIContext);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    async function fetchTickets() {
      setTickets(await getTicketsForCurrentUser());
    }
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Col xs={12} sm={10} md={6}>
          <h2>All Your Tickets are Listed below:</h2>
          {tickets == null ? (
            <Card>
              <Card.Body>Loading...</Card.Body>
            </Card>
          ) : tickets.length === 0 ? (
            <Card>
              <Card.Body>You have no tickets to display.</Card.Body>
            </Card>
          ) : (
            tickets.map((t) => <Ticket ticket={t} key={t.ticket_id} />)
          )}
        </Col>
      </Container>
    </div>
  );
}
