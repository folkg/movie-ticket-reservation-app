const connection = require("../config/database");

const serviceMethods = {};

// returns credit object if it exists else returns [];
// requires a ticket_id
serviceMethods.getCreditByTicket = (ticket_id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM REFUND WHERE ticket_id = ? AND credit_available > 0 AND expiration_date > ?`,
      [ticket_id, new Date()],
      (err, result) => {
        if (err) return reject(err);
        return resolve(result[0]);
      }
    );
  });
};

// returns all credit objects specific to a user
// else returns []
// requires a user_id
serviceMethods.getCreditByUser = (user_id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT r.id, t.ticket_id, credit_available FROM REFUND c inner join TICKET t on c.ticket_id = t.ticket_id
	        inner join REGISTERED_USER r on t.user_id = r.id WHERE r.id = ? AND credit_available > 0 AND expiration_date > ?`,
      [user_id, new Date()],
      (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      }
    );
  });
};

// returns nothing
// updates credit within the credit table. requires format in a credit obj with ticket_id and credit_available keys
serviceMethods.updateCredit = (p_id, credit_obj) => {
  return new Promise((resolve, reject) => {
    credit_obj.forEach(async (credit_item) => {
      const { ticket_id, credit_available, refund } = credit_item;
      if(refund) await serviceMethods.useCreditAsRefund(p_id, refund, ticket_id);
      connection.query(
        `UPDATE REFUND SET credit_available = ? WHERE ticket_id = ?`,
        [credit_available, ticket_id],
        (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  });
};

// return the new refund object
// should add the credit to refund.
serviceMethods.useCreditAsRefund = (p_id, refund_amount, ticket_id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO REFUND_PAYMENT(payment_id, refund_amount, refund_ticket_id) Values(?, ?, ?)`,
      [p_id, refund_amount, ticket_id],
      (err, result) => {
        if (err) return reject(err);
      }
    );
    connection.query(
      `SELECT * FROM REFUND_PAYMENT WHERE payment_id = ?`,
      [p_id],
      (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      }
    );
  });
};

module.exports = serviceMethods;
