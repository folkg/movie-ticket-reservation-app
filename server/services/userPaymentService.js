const { v4: uuid } = require("uuid");
const userPayment = require("./userPayment");

class userPaymentService extends userPayment{

    connection
    refundService
    seatService

    constructor() {
        super();
        this.connection = require("../config/database");
        this.refundService = require("../services/refundService");
        this.seatService = require("../services/seatService");
    }

// Returns the credit card info for a specific user.
creditCardByUserId = (user_id) => {
  return new Promise((resolve, reject) => {
    this.connection.query(
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
makePayment = (credit_card, amount) => {
  return new Promise((resolve, reject) => {
    let date = new Date();
    console.log(date);
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
storeCreditCardPayment = ( id, amount, credit_card ) => {
  return new Promise((resolve, reject) => {
    this.connection.query(
      `INSERT INTO CREDIT_PAYMENT(payment_id, amount, credit_card) VALUES(?, ?, ?)`,
      [id, amount, credit_card],
      (err, result) => {
        if (err) return reject(err);
      }
    );
    this.connection.query(
      `SELECT * FROM CREDIT_PAYMENT WHERE payment_id = ?`,
      [id],
      (err, result) => {
        if (err) return reject(err);
        return resolve(result[0]);
      }
    );
  });
};

storePayment = ( total_amount ) => {
  return new Promise((resolve, reject) => {
    const id = uuid();
    this.connection.query(
      `INSERT INTO PAYMENT(payment_id, total_amount, completion_date) VALUES (?, ?, ?)`,
      [id, total_amount, new Date()], 
      (err, result) => {
        if(err) return reject(err);
      }
    );
    this.connection.query(
      `SELECT * FROM PAYMENT WHERE payment_id = ?`,
      [id],
      (err, result) => {
        if (err) return reject(err);
        return resolve(result[0]);
      }
    );
  })
} 

getOnePayment = ( payment_id ) => {
  return new Promise((resolve, reject) => {
    this.connection.query(
      `SELECT * FROM PAYMENT WHERE payment_id = ?`, 
      [payment_id],
      (err, result) => {
        if(err) return reject(err);
        return resolve(result[0]);
      }
    )
  })
}

// non registered
pay = ( req ) => {
    return new Promise( async (resolve, reject) => {
      try{
        const { seat_id, ticket_id, use_credit, credit_card } = req.body;
        let seat_result = await this.seatService.getOneSeat(seat_id, false);
        if(!seat_result) return reject({ message: "Seat not found" });
        const { cost } = seat_result;
        let outstanding_charge = cost;
        let credit = [];
        let billed_amount = 0;
  
        if (use_credit) {
          const refund_obj = await this.refundService.getCreditByTicket(ticket_id)
          if(!refund_obj) return reject({ message: "Ticket is not associated with any refunds" });
          let temp = outstanding_charge - refund_obj.credit_available;
          if(temp < 0) temp = 0;
          let refund = outstanding_charge - temp;
          refund_obj.credit_available = refund_obj.credit_available - refund;
          refund_obj.refund = refund;
          outstanding_charge = temp;
          credit.push(refund_obj);
        }
        if (outstanding_charge > 0) {
          const payment_result = await this.makePayment(
            credit_card,
            outstanding_charge
          );
          if (!payment_result.success) return reject({ message: "Payment Denied" });
          console.log(payment_result.completion_date);
          ({ billed_amount } = payment_result);
        }
        const payment = await this.storePayment( cost );
        if(!payment) return reject({ message: "Payment Storage Issue" });
        const { payment_id } = payment;
        if(billed_amount > 0) await this.storeCreditCardPayment( payment_id, billed_amount, credit_card);
        if (credit.length > 0) await this.refundService.updateCredit(payment_id, credit);
        return resolve(payment);
      } catch(e) {
        reject(e);
      }
    });
  
  }

}

module.exports = userPaymentService;
