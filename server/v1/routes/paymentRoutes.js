const express = require("express");
const { checkUserId } = require("../../auth/token_validation");
const paymentController = require("../../controllers/paymentController");

const router = express.Router();

// RETURNS: { "success": true, "data": {
//            "payment_id": "23830870-1cea-4ca8-9627-69c6f519c3c0",
//            "total_amount": 10,
//            "completion_date": "2022-11-30T06:16:03.000Z"
//            }
// }
router.put('/', checkUserId, paymentController.pay);



module.exports = router;