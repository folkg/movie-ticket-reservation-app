const connection = require("../config/database");
const { v4: uuid } = require("uuid");

const serviceMethods = {}

// Returns the credit card info for a specific user. 
serviceMethods.creditCardByUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT credit_card FROM registered_user WHERE id = ?`,
            [user_id],
            (err, result) => {
                if(err) return reject(err);
                return resolve(result);
            }
        )
    });
}


// DUMMY METHOD TO SIMULATE PAYMENT, 
// RETURNS A DUMMY PAYMENT OBJECT
serviceMethods.makePayment = (credit_card, amount) => {
    return new Promise((resolve, reject) => {
        let date = new Date();
        if(!credit_card) {
            return reject({success: false, message:"no valid cc number"});
        }
        return resolve({success: true, cc_number: credit_card, billed_amount: amount, completion_date: date});
    });
}


// Returns the new credit card payment object
// after inserting into database.
serviceMethods.storeCreditCardPayment = (id, total_amount, credit_card, cc_amount, date) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO PAYMENT(payment_id, total_amount, credit_card, cc_amount, completion_date) VALUES(?, ?, ?, ?, ?)`,
            [id, total_amount,credit_card, cc_amount, date],
            (err, result) => {
                if(err) return reject(err);
            }
        )
        connection.query(
            `SELECT * FROM PAYMENT WHERE payment_id = ?`, 
            [id], 
            (err, result) => {
                if(err) return reject(err);
                return resolve(result);
            }
        )
    });
}






module.exports = serviceMethods;