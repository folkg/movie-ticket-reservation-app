const showingService = require("../services/showingService");
const { getAllSeats } = require("../services/seatService");

const controllerMethods = {};

controllerMethods.getAllShowings = async (req, res) => {
  try {
    const { query } = req;
    const isRegisteredUser = req.userId != null;
    let results = await showingService.getAllShowings(isRegisteredUser, query);
    if (results.length > 0) {
      res.json({ success: true, data: results });
    } else {
      res.json({ success: false, message: "No showings found." });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

controllerMethods.getOneShowing = async (req, res) => {
  try {
    const { showing_id } = req.params;
    const isRegisteredUser = req.userId != null;
    let results = await showingService.getOneShowing(
      showing_id,
      isRegisteredUser
    );
    if (results) {
      // add a list of all seats for the chosen showing
      const query = {};
      query.showing_id = showing_id;
      let seats = await getAllSeats(isRegisteredUser, query);
      results.seats = seats;
      res.json({ success: true, data: results });
    } else {
      res.json({ success: false, message: "Showing not found." });
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
