const DatabaseConnection = require("../config/database");
const dbc = DatabaseConnection.getinstance(); // get Singleton instance
const connection = dbc.getConnection();

const { getOneSeat } = require("../services/seatService");
const { getOnePayment } = require("../services/paymentService");
const constants = require("../config/constants");
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
        return resolve(results[0]);
      }
    );
  });
};

// Create Ticket.
// REQUIRES: User_id, and the body to contain key for "seat_id" and "cost"
// RETURNS {user_id:"", seat_id:"", cost: "", isCredit: ""}
serviceMethods.createTicket = (body, user_id) => {
  return new Promise(async (resolve, reject) => {
    const { seat_id, payment_id } = body;
    const ticket_id = uuid();
    const isRegisteredUser = user_id != null;
    // Get provided seat to ensure it is available
    const seat = await getOneSeat(seat_id, isRegisteredUser);
    if (!seat) return reject({ message: "Selected seat not found." });
    const payment = await getOnePayment(payment_id);
    if(!payment) return reject({ message: "Payment was not found" });
    if (seat.is_available && seat.cost === payment.total_amount) {
      connection.query(
        `INSERT INTO TICKET(ticket_id, user_id, seat_id, payment_id) VALUES (?, ?, ?, ?)`,
        [ticket_id, user_id, seat_id, payment_id],
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
            `SELECT * FROM TICKET WHERE ticket_id = ?`,
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

// TODO: Add query to get the total payment from refund_payment and credit_payment so we can remove total payment all together.
// TODO: Do we need to check if seat is available? or do we do this during payment? ask Graeme
// TODO: I think the  route should be POST /tickets/:ticket_id, body should be "cancel":true
// Cancel Ticket - Regardless of user type or date. Controller must do logic to
// determine additional details.
// REQUIRES: ticket_id, seat_id, and credit
// RETURNS {ticket_id:"", credit_available: ""}
serviceMethods.cancelTicketById = ( body, isRegisteredUser ) => {
  return new Promise(async (resolve, reject) => {
    const { ticket_id } = body;
    let ticket = await serviceMethods.getTicketById(ticket_id);
    if(!ticket) return reject({ message: "Selected Ticket Not Found" })
    const { user_id, seat_id, show_time } = ticket;
    const seat = await getOneSeat(seat_id, isRegisteredUser);
    if (!seat) return reject({ message: "No Seat Found for Ticket" });
    const { cost } = seat;
    isRegisteredUser = isRegisteredUser || user_id != null;
    if (!canCancel(show_time)) return reject({ message: "Show time less than 72 hours away, cancellation not fulfilled." });
    let credit = cost;
    const expiration_date = getExpirationDate();
    // Apply admin fee if the user is not registered.
    if (!isRegisteredUser) credit = cost * (1 - constants.ADMIN_FEE);
    connection.query(
      `UPDATE SEATS SET booked = false WHERE seat_id = ?`,
      [seat_id],
      (err, results) => {
        if (err) return reject(err);
        connection.query(
          `INSERT INTO REFUND(ticket_id, credit_available, expiration_date) VALUES (?, ?, ?)`,
          [ticket_id, credit, expiration_date],
          (err, results) => {
            if (err) return reject(err);
          }
        );
        connection.query(
          `UPDATE TICKET SET is_credited = true WHERE ticket_id = ?`, 
          [ticket_id], 
          (err, results) => {
            if(err) return reject(err);
          }
        )
        connection.query(
          `SELECT * FROM REFUND WHERE Ticket_id = ?`,
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


// canCancel checks the difference between the current time and the
// showtime. Returns true if the distance is >= 72 hours else returns
// false.
function canCancel(show_time) {
  // Add UTC OFFSET to compensate for Mountain Standard Time.
  let show_time_date = new Date(new Date(show_time) + constants.UTC_OFFSET);
  let current_date = new Date();
  difference = show_time_date.getTime() - current_date.getTime();
  hours = difference / (1000 * 3600);
  let cancel;
  hours >= 72 ? (cancel = true) : (cancel = false);
  return cancel;
}

function getExpirationDate(){
  let current_date = new Date();
  let exp_time = current_date.getTime() + constants.EXPIRATION_PERIOD;
  return new Date(exp_time);
}