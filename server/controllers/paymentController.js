const creditService = require("../services/creditService");
const creditCardService = require("../services/creditCardService");
const { v4: uuid } = require("uuid");

const controllerMethods = {};

// need the credit ticket ID in param. 
controllerMethods.getCreditByTicket =  async (req, res) => {
   try {
        const { ticket_id } = req.params;
        console.log(ticket_id);
        let results = await creditService.getCreditByTicket(ticket_id);
        if (results) {
            res.json({ status: true, data: results });
          } else {
            res.status(204).json({ status: false, message: "no credit available" });
          }
   } catch (e) {
        res.status(500).json({status: false, message: e.message});
   }
}

controllerMethods.getTotalCreditByUser = async (req, res) => {
    try {
        const user_id = req.userId;
        const isRegisteredUser = user_id != null;
        if(!isRegisteredUser) res.json({status: false, message: "user id not found"});
        else {
            let credits = await creditService.getCreditByUser(user_id);
            let total_credit = 0;
            if(credits){
                credits.forEach(credit => {
                    total_credit += credit.credit_available;
                });
                res.json({status: true, data: total_credit});
            } else {
                res.json({status: false, message: "user has no credits"})
            }
        }
    } catch (e) {
        res.json({status: false, message: e.message});
    }
}

// as is need the body to contain amount and credit_card number (if no number then we query the database for userid.
// TODO, use seat methods to get the seat object and use that as amount. 
controllerMethods.payWithCard = async (req, res) => {
    try {
        // should query seat possibly to get cost not amount here. 
        const {amount} = req.body
        let { credit_card } = req.body;
        const user_id = req.userId;
        if(!credit_card && user_id){
            let result = await creditCardService.creditCardByUserId(user_id);
            credit_card = result[0].credit_card;
        } 
        let payment_result = await creditCardService.makePayment(credit_card, amount);
        console.log(payment_result);
        if(!payment_result.success) res.json({success: false, message: "payment failed"});
        else {
            const {billed_amount, completion_date} = payment_result;
            const id = uuid();
            let result = await creditCardService.storeCreditCardPayment(id, billed_amount, credit_card, billed_amount, completion_date);
            res.json({success: true, data: result});
        }
    } catch (e) {
        res.json({success: false, message: e.message});
    }
}

// in body will need the seat_id, credit_card number and ticket_id if for credit
// and amount right now. should change to seat. 
controllerMethods.payBothWays = async (req, res) => {
    try {
        const user_id = req.userId;
        const isRegisteredUser = user_id != null;
        const { amount, ticket_id, use_credit} = req.body;
        let outstanding_charge = amount;
        let { credit_card } = req.body;
        let credits;
        let refunds = [];
        let billed_amount = 0;
        let completion_date = new Date();

        if(use_credit){
            if(isRegisteredUser) credits = await creditService.getCreditByUser(user_id);
            else credits = await creditService.getCreditByTicket(ticket_id);
            credits.every((credit) => {
                
                outstanding_charge -= credit.credit_available;
                if(outstanding_charge >= 0) credit.credit_available = 0;
                else {
                    credit.credit_available = Math.abs(outstanding_charge);
                    outstanding_charge = 0;
                }
                refunds.push(credit)
                if (outstanding_charge === 0) return false; 
            });
        } 
        if(outstanding_charge > 0) {
            if(!credit_card && user_id){
                let result = await creditCardService.creditCardByUserId(user_id);
                credit_card = result[0].credit_card;
            }
            let payment_result = await creditCardService.makePayment(credit_card, outstanding_charge);
            if(!payment_result.success) res.json({success: false, message: "payment failed"});
            else {
            ({billed_amount, completion_date} = payment_result);
            }
            
        }
        const id = uuid();
        let result = await creditCardService.storeCreditCardPayment(id, amount, credit_card, billed_amount, completion_date);
        if(refunds) await creditService.updateCredit(id, refunds);
        res.json({success: true, data: result});


    } catch (e) {
        res.json({success: false, message: e.message})
    }


}

module.exports = controllerMethods;