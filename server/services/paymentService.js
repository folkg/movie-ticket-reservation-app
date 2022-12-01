const DatabaseConnection = require("../config/database");
const dbc = DatabaseConnection.getinstance(); // get Singleton instance
const connection = dbc.getConnection();

const refundService = require("../services/refundService");
const seatService = require("../services/seatService");
const { v4: uuid } = require("uuid");

const serviceMethods = {};

// Returns the credit card info for a specific user.
serviceMethods.creditCardByUserId = (user_id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT credit_card FROM REGISTERED_USER WHERE id = ?`,
      [user_id],
      (err, result) => {
        if (err) return reject(err);
        return resolve(result[0]);
      }
    );
  });
};

// DUMMY METHOD TO SIMULATE PAYMENT,
// RETURNS A DUMMY PAYMENT OBJECT
serviceMethods.makePayment = (credit_card, amount) => {
  return new Promise((resolve, reject) => {
    let date = new Date();
    if (!credit_card) {
      return reject({ success: false, message: "no valid cc number" });
    }
    return resolve({
      success: true,
      cc_number: credit_card,
      billed_amount: amount,
      completion_date: date,
    });
  });
};

// Returns the new credit card payment object
// after inserting into database.
serviceMethods.storeCreditCardPayment = (id, amount, credit_card) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO CREDIT_PAYMENT(payment_id, amount, credit_card) VALUES(?, ?, ?)`,
      [id, amount, credit_card],
      (err, result) => {
        if (err) return reject(err);
      }
    );
    connection.query(
      `SELECT * FROM CREDIT_PAYMENT WHERE payment_id = ?`,
      [id],
      (err, result) => {
        if (err) return reject(err);
        return resolve(result[0]);
      }
    );
  });
};

serviceMethods.storePayment = (total_amount) => {
  return new Promise((resolve, reject) => {
    const id = uuid();
    connection.query(
      `INSERT INTO PAYMENT(payment_id, total_amount, completion_date) VALUES (?, ?, ?)`,
      [id, total_amount, new Date()],
      (err, result) => {
        if (err) return reject(err);
      }
    );
    connection.query(
      `SELECT * FROM PAYMENT WHERE payment_id = ?`,
      [id],
      (err, result) => {
        if (err) return reject(err);
        return resolve(result[0]);
      }
    );
  });
};

serviceMethods.getOnePayment = (payment_id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM PAYMENT WHERE payment_id = ?`,
      [payment_id],
      (err, result) => {
        if (err) return reject(err);
        return resolve(result[0]);
      }
    );
  });
};

// registered
serviceMethods.pay1 = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { seat_id, use_credit } = req.body;
      const user_id = req.userId;
      let { credit_card } = req.body;
      let seat_result = await seatService.getOneSeat(seat_id, true);
      if (!seat_result) return reject({ message: "Seat not found" });
      const { cost } = seat_result;
      let outstanding_charge = cost;
      let credits = [];
      let billed_amount = 0;

      if (use_credit) {
        credits = await refundService.getCreditByUser(user_id);
        if (credits.length === 0)
          return reject({ message: "No Credit Available for User" });
        credits.every((credit) => {
          let temp = outstanding_charge - credit.credit_available;
          if (temp < 0) temp = 0;
          let refund = outstanding_charge - temp;
          credit.credit_available = credit.credit_available - refund;
          credit.refund = refund;
          outstanding_charge = temp;
          return outstanding_charge != 0;
        });
      }
      if (outstanding_charge > 0) {
        if (!credit_card && user_id) {
          const user_cc = await serviceMethods.creditCardByUserId(user_id);
          if (!user_cc)
            return reject({
              message: "No Credit Card Information Available for User",
            });
          credit_card = user_cc.credit_card;
        }
        const payment_result = await serviceMethods.makePayment(
          credit_card,
          outstanding_charge
        );
        if (!payment_result.success)
          return reject({ message: "Payment Denied" });
        ({ billed_amount, completion_date } = payment_result);
      }
      const payment = await serviceMethods.storePayment(cost);
      if (!payment) return reject({ message: "Credit_Payment Storage Issue" });
      const { payment_id } = payment;
      if (billed_amount > 0)
        await serviceMethods.storeCreditCardPayment(
          payment_id,
          billed_amount,
          credit_card
        );
      if (credits.length > 0)
        await refundService.updateCredit(payment_id, credits);
      return resolve(payment);
    } catch (e) {
      reject(e);
    }
  });
};
// non registered
serviceMethods.pay2 = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { seat_id, ticket_id, use_credit, credit_card } = req.body;
      let seat_result = await seatService.getOneSeat(seat_id, false);
      if (!seat_result) return reject({ message: "Seat not found" });
      const { cost } = seat_result;
      let outstanding_charge = cost;
      let credit = [];
      let billed_amount = 0;

      if (use_credit) {
        const refund_obj = await refundService.getCreditByTicket(ticket_id);
        if (!refund_obj)
          return reject({
            message: "Ticket is not associated with any refunds",
          });
        let temp = outstanding_charge - refund_obj.credit_available;
        if (temp < 0) temp = 0;
        let refund = outstanding_charge - temp;
        refund_obj.credit_available = refund_obj.credit_available - refund;
        refund_obj.refund = refund;
        outstanding_charge = temp;
        credit.push(refund_obj);
      }
      if (outstanding_charge > 0) {
        const payment_result = await serviceMethods.makePayment(
          credit_card,
          outstanding_charge
        );
        if (!payment_result.success)
          return reject({ message: "Payment Denied" });
        ({ billed_amount, completion_date } = payment_result);
      }
      const payment = await serviceMethods.storePayment(cost);
      if (!payment) return reject({ message: "Payment Storage Issue" });
      const { payment_id } = payment;
      if (billed_amount > 0)
        await serviceMethods.storeCreditCardPayment(
          payment_id,
          billed_amount,
          credit_card
        );
      if (credit.length > 0)
        await refundService.updateCredit(payment_id, credit);
      return resolve(payment);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = serviceMethods;
