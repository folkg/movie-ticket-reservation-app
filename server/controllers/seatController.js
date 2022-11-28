const seatService = require("../services/seatService");
const { isPresaleRestricted } = require("../services/showingService");
const showingService = require("../services/showingService");

const controllerMethods = {};

controllerMethods.getAllSeats = async (req, res) => {
  try {
    const { query } = req;
    const isRegisteredUser = req.userId != null;
    const results = await seatService.getAllSeats(isRegisteredUser, query);
    if (results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        // Determine if seat is available or not (takes into account 10% presale limit)
        console.log(
          await showingService.isPresaleRestricted(results[i].showing_id)
        );
        results[i].is_available = !(
          results[i].booked ||
          (await showingService.isPresaleRestricted(results[i].showing_id))
        );
        delete results[i].booked;
      }
      res.json({ success: true, data: results });
    } else {
      res.json({ success: false, message: "No seats found." });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

controllerMethods.getOneSeat = async (req, res) => {
  try {
    const { seat_id } = req.params;
    const isRegisteredUser = req.userId != null;
    let results = await seatService.getOneSeat(seat_id, isRegisteredUser);
    if (results) {
      // Determine if seat is available or not (takes into account 10% presale limit)
      results.is_available = !(
        results.booked ||
        (await showingService.isPresaleRestricted(results.showing_id))
      );
      delete results.booked;
      res.json({ success: true, data: results });
    } else {
      res.json({ success: false, message: "Seat not found." });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports = controllerMethods;
