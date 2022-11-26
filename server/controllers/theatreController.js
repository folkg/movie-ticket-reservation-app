const theatreService = require("../services/theatreService");

const controllerMethods = {};

controllerMethods.getAllTheatres = async (req, res) => {
  theatreService.getAllTheatres();
  res.send("Get All Theatres.");
};

controllerMethods.getOneTheatre = async (req, res) => {
  theatreService.getOneTheatre(id);
  res.send("Get One Theatre.");
};

controllerMethods.createTheatre = async (req, res) => {
  theatreService.createTheatre(body);
  res.send("Create Theatre.");
};

controllerMethods.updateTheatre = async (req, res) => {
  theatreService.updateTheatre(body, id);
  res.send("Update Theatre.");
};

controllerMethods.deleteTheatre = async (req, res) => {
  theatreService.deleteTheatre(id);
  res.send("Delete Theatre.");
};

controllerMethods.getMovieForTheatre = async (req, res) => {
  theatreService.getMovieForTheatre(id);
  res.send("Get Movie for Theatre.");
};

controllerMethods.getShowTimeForTheatre = async (req, res) => {
  theatreService.getShowTimeForTheatre(id);
  res.send("Get ShowTime Theatre.");
};

module.exports = controllerMethods;
