import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Container, Col, Card } from "react-bootstrap";
import Ticket from "../../components/ticket/ticket.component";
import { MovieAPIContext } from "../../contexts/movie-api-provider";

export default function TicketPage() {
  const { ticket_id } = useParams();
  const { getTicketById } = useContext(MovieAPIContext);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    async function fetchTickets() {
      const results = await getTicketById(ticket_id);
      if (results) setTicket(results);
    }
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container>
      <Col
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "600px",
        }}
      >
        {ticket == null ? (
          <Card className="p-2 m-2">
            <Card.Body>Loading...</Card.Body>
          </Card>
        ) : ticket.length === 0 ? (
          <Card className="p-2 m-2">
            <Card.Body>Ticket #{ticket_id} not found.</Card.Body>
          </Card>
        ) : (
          <div>
            <h2 className="text-center">Viewing Ticket #{ticket_id}</h2>
            <Ticket ticket={ticket} />
          </div>
        )}
      </Col>
    </Container>
  );
}
