const userPayment = require("../services/userPayment");

class paymentController {

  paymentService;

  setPaymentStrategy = (userPayment) => {
      this.paymentService = userPayment;
  }
    
  pay = async (req, res) => {
    try {
      
      let result = await this.paymentService.pay( req );
      res.json({ success: true, data: result });
    } catch (e) {
      res.json({ success: false, message: e.message });
    }
};
  
}

module.exports = paymentController;

