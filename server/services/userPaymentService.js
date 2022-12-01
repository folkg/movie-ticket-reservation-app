const userPayment = require("./userPayment");

class userPaymentService extends userPayment{

    constructor() {
        super();
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
          const payment_result = await this.paymentService.makePayment(
            credit_card,
            outstanding_charge
          );
          if (!payment_result.success) return reject({ message: "Payment Denied" });
          ({ billed_amount } = payment_result);
        }
        const payment = await this.paymentService.storePayment();
        if(!payment) return reject({ message: "Payment Storage Issue" });
        const { payment_id } = payment;
        if(billed_amount > 0) await this.paymentService.storeCreditCardPayment( payment_id, billed_amount, credit_card);
        if (credit.length > 0) await this.refundService.updateCredit(payment_id, credit);
        return resolve(payment);
      } catch(e) {
        reject(e);
      }
    });
  
  }

}

module.exports = userPaymentService;
