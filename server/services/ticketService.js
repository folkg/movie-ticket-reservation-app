const connection = require("../config/database");
const constants = require("../config/constants")
const { v4: uuid } = require("uuid");

const serviceMethods = {};

// Return all tickets.
// Likely never needed.
serviceMethods.getAllTickets = () => {

    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM TICKET`,
            (err, results) => {
              if (err) return reject(err);
              return resolve(results);
            }
          );
    })
}

// Get Tickets by ID only.
// RETURNS {user_id:"", seat_id:"", cost: "", show_time: ""}
serviceMethods.getTicketById = (ticket_id) => {

    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT user_id, S.seat_id, cost, show_time from Showing SH Inner join Seats S ON SH.showing_id = S.showing_id 
            INNER JOIN TICKET T ON S.seat_id = T.seat_id Where T.ticket_id = ?`, 
            [ticket_id],
            (err, results) => {
                if(err) return reject(err);
                return resolve(results);
            });
    });
};

// Create Ticket.
// REQUIRES: User_id, and the body to contain key for "seat_id" and "cost"
// RETURNS {user_id:"", seat_id:"", cost: "", isCredit: ""}
// TODO: ASSUMES THE SEAT IS AVAILABLE. Could be problematic if there are threads occuring. (Add check to see if seat still available before confirming?)
serviceMethods.createTicket = (body, user_id) => {
    return new Promise((resolve, reject) => {
        const { seat_id, cost } = body;
        const ticket_id = uuid();
        console.log(ticket_id);
        console.log(user_id);
        connection.query(
            `INSERT INTO TICKET(ticket_id, user_id, seat_id, cost) VALUES (?, ?, ?, ?)`, 
            [ticket_id, user_id, seat_id, cost],
            async (err, results) => {
                if(err) return reject(err);
                connection.query(
                    `UPDATE SEATS SET booked = true WHERE seat_id = ?`, 
                    [seat_id],
                    (err, results) => {
                        if(err) return reject(err);
                    }
                )
                connection.query(
                    `SELECT * FROM TICKET WHERE Ticket_id = ?`, 
                    [ticket_id],
                    (err, results) => {
                        if(err) return reject(err);
                        return resolve(results[0]);
                    });
            });
    });
};

// Cancel Ticket - Regardless of user type or date. Controller must do logic to 
// determine additional details. 
// REQUIRES: ticket_id, seat_id, and credit 
// RETURNS {ticket_id:"", credit_available: ""}
serviceMethods.cancelTicketById = (ticket_id, seat_id, credit) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `UPDATE SEATS SET booked = false WHERE seat_id = ?`, 
            [seat_id],
            (err, results) => {
                if(err) return reject(err);
                connection.query(
                    `INSERT INTO CREDIT(ticket_id, credit_available) VALUES (?, ?)`, 
                    [ticket_id, credit],
                    (err, results) => {
                        if(err) return reject(err);
                    }
                );
                connection.query(
                    `SELECT * FROM CREDIT WHERE Ticket_id = ?`, 
                    [ticket_id],
                    (err, results) => {
                        if(err) return reject(err);
                        return resolve(results);
                    });
            });
    });
};




module.exports = serviceMethods;
