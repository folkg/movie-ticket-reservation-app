import React, { useContext } from "react";
import GuestCancelTicketForm from "../../components/cancelTicketForm/guestCancelTicketForm.component";
import RegisteredCancelTicketForm from "../../components/ticket/viewUserTickets.component";
import { MovieAPIContext } from "../../contexts/movie-api-provider";

function CancelPage() {
  const { isLoggedIn } = useContext(MovieAPIContext);
  return isLoggedIn ? (
    <RegisteredCancelTicketForm />
  ) : (
    <GuestCancelTicketForm />
  );
}

export default CancelPage;
