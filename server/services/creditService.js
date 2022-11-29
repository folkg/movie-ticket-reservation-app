const connection = require("../config/database");
const { v4: uuid } = require("uuid");

const serviceMethods = {};

// returns credit object if it exists else returns [];
// requires a ticket_id
serviceMethods.getCreditByTicket = (ticket_id) => {
    return new Promise((resolve, reject) => {
        console.log(ticket_id);
        connection.query(
            `SELECT * FROM CREDIT WHERE ticket_id = ? AND credit_available > 0 AND expiration_date > ?`,
            [ticket_id, new Date()],
            (err, result) => {
                if(err) return reject(err);
                
                return resolve(result);
            }

        );
    });
}

// returns all credit objects specific to a user
// else returns []
// requires a user_id
serviceMethods.getCreditByUser = (user_id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT r.id, T.ticket_id, credit_available FROM credit c inner join ticket t on c.ticket_id = t.ticket_id
	        inner join registered_user r on t.user_id = r.id WHERE r.id = ? AND credit_available > 0 AND expiration_date > ?`,
            [user_id, new Date()],
            (err, result) => {
                    if(err)return reject(err);
                    return resolve(result);
            } 
        )
    });
}

// returns nothing
// updates credit within the credit table. requires format in a credit obj with ticket_id and credit_available keys
serviceMethods.updateCredit = (p_id, credit_obj) => {
    return new Promise((resolve, reject) => {
        
        credit_obj.forEach( async(credit_item) => {
            const { ticket_id, credit_available } = credit_item;
            await serviceMethods.useCreditAsRefund(p_id, ticket_id);
            connection.query(
                `UPDATE CREDIT SET credit_available = ? WHERE ticket_id = ?`,
                [credit_available, ticket_id],
                (err, result) => {
                    if(err) return reject(err);
                    return(resolve(result));
                }
            );
        });
        
    })
}


// return the new refund object 
// should add the credit to refund. 
serviceMethods.useCreditAsRefund = (p_id, ticket_id) => {
    return new Promise((resolve, reject) => {
        const r_id = uuid();
        connection.query(
            `INSERT INTO REFUND (refund_id, ticket_id, payment_id) Values(?, ?, ?)`,
            [r_id, ticket_id, p_id],
            (err, result) => {
                if(err) return reject(err);
            }
        )
        //possible could get the credit object back here and user updatecredit to update it. 
        connection.query(
            `SELECT * FROM REFUND WHERE refund_id = ?`,
            [r_id],
            (err, result) => {
                if(err) return reject(err);
                return resolve(result);
            }
        )
    })
}



module.exports = serviceMethods;