const userPayment = require("./userPayment");

class regUserPaymentService extends userPayment{

    constructor() {
        super();
    }

// registered
pay = ( req ) => {
  return new Promise( async (resolve, reject) => {
    try {
      const { seat_id, use_credit } = req.body;
      const user_id = req.userId;
      let { credit_card } = req.body;
      let seat_result = await this.seatService.getOneSeat(seat_id, true); 
      if(!seat_result) return reject({ message: "Seat not found" });
      const { cost } = seat_result;
      let outstanding_charge = cost;
      let credits = [];
      let billed_amount = 0;
      
      if (use_credit) {
        credits = await this.refundService.getCreditByUser(user_id);
        if(credits.length === 0) return reject({ message: "No Credit Available for User" })
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
          const user_cc = await this.paymentService.creditCardByUserId(user_id);
          if(!user_cc) return reject({ message: "No Credit Card Information Available for User" });
          credit_card = user_cc.credit_card;
        }
        const payment_result = await this.paymentService.makePayment(
          credit_card,
          outstanding_charge
        );
        if (!payment_result.success) return reject({ message: "Payment Denied" });
        ({ billed_amount } = payment_result);
      }
      const payment = await this.paymentService.storePayment();
      if(!payment) return reject({ message: "Credit_Payment Storage Issue" });
      const { payment_id } = payment;
      if(billed_amount > 0) await this.paymentService.storeCreditCardPayment( payment_id, billed_amount, credit_card);
      if (credits.length > 0) await this.refundService.updateCredit(payment_id, credits);
      return resolve(payment);
    } catch(e) {
      reject(e);
    }
  });
    
}

}

module.exports = regUserPaymentService;
