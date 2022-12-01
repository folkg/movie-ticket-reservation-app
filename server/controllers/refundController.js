const refundService = require("../services/refundService");

const controllerMethods = {};

controllerMethods.getCreditByTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    let results = await refundService.getCreditByTicket(ticket_id);
    if (results) {
      res.json({ status: true, data: results });
    } else {
      res.status(404).json({ status: false, message: "no credit available" });
    }
  } catch (e) {
    res.status(500).json({ status: false, message: e.message });
  }
};

controllerMethods.getTotalCreditByUser = async (req, res) => {
  try {
    const user_id = req.userId;
    const isRegisteredUser = user_id != null;
    if (!isRegisteredUser)
      res.status(404).json({ status: false, message: "user id not found" });
    else {
      let credits = await refundService.getCreditByUser(user_id);
      let total_credit = 0;
      if (credits.length > 0) {
        credits.forEach((credit) => {
          total_credit += credit.credit_available;
        });
        res.json({ status: true, data: total_credit });
      } else {
        res.json({ status: false, message: "user has no credits" });
      }
    }
  } catch (e) {
    res.json({ status: false, message: e.message });
  }
};

module.exports = controllerMethods;
