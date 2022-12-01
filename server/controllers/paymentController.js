// const refundService = require("../services/refundService");
const paymentService = require("../services/paymentService");
// const seatService = require("../services/seatService");
const { v4: uuid } = require("uuid");
const e = require("express");

const controllerMethods = {};

controllerMethods.pay = async (req, res) => {
  try {
    const user_id = req.userId;
    const isRegisteredUser = user_id != null;
    let result;
    if(isRegisteredUser) result = await paymentService.pay1( req );
    else result = await paymentService.pay2( req );
    res.json({ success: true, data: result });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

module.exports = controllerMethods;
