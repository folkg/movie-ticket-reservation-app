const express = require("express");
const { checkUserId } = require("../../auth/token_validation");
const paymentController = require("../../controllers/paymentController");

const router = express.Router();

router.get('/:ticket_id', paymentController.getCreditByTicket);

router.get('/', checkUserId, paymentController.getTotalCreditByUser);

router.put('/', checkUserId, paymentController.payWithCard);

router.patch('/', checkUserId, paymentController.payBothWays);


module.exports = router;