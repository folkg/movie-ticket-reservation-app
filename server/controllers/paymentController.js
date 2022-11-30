const refundService = require("../services/refundService");
const paymentService = require("../services/paymentService");
const seatService = require("../services/seatService");
const { v4: uuid } = require("uuid");
const e = require("express");

const controllerMethods = {};

controllerMethods.pay = async (req, res) => {
  try {
    const user_id = req.userId;
    const isRegisteredUser = user_id != null;
    const { seat_id, ticket_id, use_credit } = req.body;
    // TODO: CHECK IF SEAT IS FREE HERE OR IN TICKET?!
    let { credit_card } = req.body;
    let seat_result = await seatService.getOneSeat(seat_id, isRegisteredUser);
    const { cost } = seat_result
    let outstanding_charge = cost;
    let credits = [];
    let billed_amount = 0;

    if (use_credit) {
      if (isRegisteredUser)
        credits = await refundService.getCreditByUser(user_id);
        // throw error if rej
      else credits.push(await refundService.getCreditByTicket(ticket_id));
      // throw error if rej
      credits.every((credit) => {
        let temp = outstanding_charge - credit.credit_available;
        if(temp < 0) temp = 0;
        let refund = outstanding_charge - temp;
        credit.credit_available = credit.credit_available - refund;
        credit.refund = refund;
        outstanding_charge = temp;
        return outstanding_charge != 0;
      });
    }
    if (outstanding_charge > 0) {
      if (!credit_card && user_id) {
        let result = await paymentService.creditCardByUserId(user_id);
        // throw error if rej
        credit_card = result.credit_card;
      }
      let payment_result = await paymentService.makePayment(
        credit_card,
        outstanding_charge
      );
      if (!payment_result.success)
        res.json({ success: false, message: "payment failed" });
      else {
        ({ billed_amount, completion_date } = payment_result);
      }
    }
    let payment_result = await paymentService.storePayment( cost );
    // throw error if rej
    const { payment_id } = payment_result;
    if(billed_amount > 0) await paymentService.storeCreditCardPayment( payment_id, billed_amount, credit_card);
    // throw error if rej
    if (credits.length > 0) await refundService.updateCredit(payment_id, credits);
    // throw error if rej
    res.json({ success: true, data: payment_result });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

module.exports = controllerMethods;
