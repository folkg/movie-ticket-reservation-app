const theatreService = require("../services/theatreService");
const showingService = require("../services/showingService");

const controllerMethods = {};

controllerMethods.getAllTheatres = async (req, res) => {
  try {
    let results = await theatreService.getAllTheatres();
    if (results.length > 0) {
      res.json({ success: true, data: results });
    } else {
      res.json({ success: false, message: "No theatres found." });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

controllerMethods.getOneTheatre = async (req, res) => {
  try {
    const { theatre_id } = req.params;
    const isRegisteredUser = req.userId != null;
    let results = await theatreService.getOneTheatre(
      theatre_id,
      isRegisteredUser
    );
    if (results) {
      // add a list of all showings for the chosen theatre
      const query = {};
      query.theatre_id = theatre_id;
      let showings = await showingService.getAllShowings(
        isRegisteredUser,
        query
      );
      results.showings = showings;
      res.json({ success: true, data: results });
    } else {
      res.json({ success: false, message: "Theatre not found." });
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
