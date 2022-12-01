const express = require("express");
const { checkUserId } = require("../../auth/token_validation");
const paymentController = require("../../controllers/paymentController");
const regUserPaymentService = require("../../services/regUserPaymentService");
const userPaymentService = require("../../services/userPaymentService");


const router = express.Router();

// RETURNS: { "success": true, "data": {
//            "payment_id": "23830870-1cea-4ca8-9627-69c6f519c3c0",
//            "total_amount": 10,
//            "completion_date": "2022-11-30T06:16:03.000Z"
//            }
// }
const myWayToPay = new paymentController();
const pay1 = new regUserPaymentService();
const pay2 = new userPaymentService();

const assignPaymentType = (req, res, next) => {
    const user_id = req.userId;
    if(user_id) myWayToPay.setPaymentStrategy(pay1);
    else myWayToPay.setPaymentStrategy(pay2);    
    next();
}



router.put('/', checkUserId, assignPaymentType, myWayToPay.pay);


module.exports = router;