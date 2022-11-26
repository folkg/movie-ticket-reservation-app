const movieService = require("../services/movieService");

const controllerMethods = {};

controllerMethods.getAllMovies = async (req, res) => {
  movieService.getAllMovies();
  res.send("Get All Movies.");
};

controllerMethods.getOneMovie = async (req, res) => {
  movieService.getOneMovie(id);
  res.send("Get One Movie.");
};

controllerMethods.createMovie = async (req, res) => {
  movieService.createMovie(body);
  res.send("Create Movie.");
};

controllerMethods.updateMovie = async (req, res) => {
  movieService.updateMovie(body, id);
  res.send("Update Movie.");
};

controllerMethods.deleteMovie = async (req, res) => {
  movieService.deleteMovie(id);
  res.send("Delete Movie.");
};

controllerMethods.getTheatreForMovie = async (req, res) => {
  movieService.getTheatreForMovie(id);
  res.send("Get Theatre for Movie.");
};

controllerMethods.getShowTimeForMovie = async (req, res) => {
  movieService.getShowTimeForMovie(id);
  res.send("Get ShowTime for Movie.");
};

module.exports = controllerMethods;
