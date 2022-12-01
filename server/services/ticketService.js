const DatabaseConnection = require("../config/database");
const dbc = DatabaseConnection.getinstance(); // get Singleton instance
const connection = dbc.getConnection();

const { getOneSeat } = require("../services/seatService");
const { v4: uuid } = require("uuid");

const serviceMethods = {};

// Return all tickets.
//TODO: Not returning null user_id
serviceMethods.getAllTickets = (query) => {
  return new Promise((resolve, reject) => {
    const user_id = query.user_id || "%";
    connection.query(
      `SELECT * FROM TICKET WHERE (user_id LIKE ? OR ?)`,
      [user_id, user_id === "%"],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      }
    );
  });
};

// Get Tickets by ID only.
// RETURNS {user_id:"", seat_id:"", cost: "", show_time: ""}
serviceMethods.getTicketById = (ticket_id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT user_id, S.seat_id, S.cost, show_time from SHOWING SH Inner join SEATS S ON SH.showing_id = S.showing_id 
            INNER JOIN TICKET T ON S.seat_id = T.seat_id Where T.ticket_id = ?`,
      [ticket_id],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      }
    );
  });
};

// Create Ticket.
// REQUIRES: User_id, and the body to contain key for "seat_id" and "cost"
// RETURNS {user_id:"", seat_id:"", cost: "", isCredit: ""}
serviceMethods.createTicket = (body, user_id) => {
  return new Promise(async (resolve, reject) => {
    const { seat_id } = body;
    const ticket_id = uuid();
    const isRegisteredUser = user_id != null;
    // Get provided seat to ensure it is available
    const seat = await getOneSeat(seat_id, isRegisteredUser);
    if (!seat) return reject({ message: "Selected seat not found." });
    if (seat.is_available) {
      connection.query(
        `INSERT INTO TICKET(ticket_id, user_id, seat_id) VALUES (?, ?, ?)`,
        [ticket_id, user_id, seat_id],
        async (err, results) => {
          if (err) return reject(err);
          connection.query(
            `UPDATE SEATS SET booked = true WHERE seat_id = ?`,
            [seat_id],
            (err, results) => {
              if (err) return reject(err);
            }
          );
          // TODO: This may not be an issue, but maybe we should call subsequent queries within the previous query's callback function.
          // I'm not certain, but this could be handled asyncronously by the compiler and they COULD be called out of order
          connection.query(
            `SELECT * FROM TICKET WHERE Ticket_id = ?`,
            [ticket_id],
            (err, results) => {
              if (err) return reject(err);
              return resolve(results[0]);
            }
          );
        }
      );
    } else {
      return reject({ message: "Selected seat is not available." });
    }
  });
};

// TODO: We can get the seat_id from ticket_id, so no need to pass it in body
// TODO: backend should probably calculaet the credit, not the frontend
// TODO: I think the  route should be POST /tickets/:ticket_id, body should be "cancel":true
// TODO: Update the ticket object to show isCancelled = true
// Cancel Ticket - Regardless of user type or date. Controller must do logic to
// determine additional details.
// REQUIRES: ticket_id, seat_id, and credit
// RETURNS {ticket_id:"", credit_available: ""}
serviceMethods.cancelTicketById = (
  ticket_id,
  seat_id,
  credit,
  expiration_date
) => {
  return new Promise(async (resolve, reject) => {
    connection.query(
      `UPDATE SEATS SET booked = false WHERE seat_id = ?`,
      [seat_id],
      (err, results) => {
        if (err) return reject(err);
        connection.query(
          `INSERT INTO CREDIT(ticket_id, credit_available, expiration_date) VALUES (?, ?, ?)`,
          [ticket_id, credit, expiration_date],
          (err, results) => {
            if (err) return reject(err);
          }
        );
        connection.query(
          `SELECT * FROM CREDIT WHERE Ticket_id = ?`,
          [ticket_id],
          (err, results) => {
            if (err) return reject(err);
            return resolve(results);
          }
        );
      }
    );
  });
};

module.exports = serviceMethods;
