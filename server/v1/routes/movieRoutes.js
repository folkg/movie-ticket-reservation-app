const express = require("express");
const { checkUserId } = require("../../auth/token_validation");
const apicache = require("apicache");
const movieController = require("../../controllers/movieController");

const router = express.Router();
// Added cache in just for fun.
const cache = apicache.middleware;

//NOTE: By using the 'checkUserId' function as middleware, it checks whether a user is logged in and adds the userId to to req.userId if they are
// This can be used to determine whether to return presale movies with the response

// Returns:
// {"success":true,"data":[{"movie_id":"M_001","movie_name":"Citizen Kane","isPresale":0},{"movie_id":"M_002","movie_name":"Titanic","isPresale":0},{"movie_id":"M_003","movie_name":"Demon Slayer","isPresale":0},{"movie_id":"M_004","movie_name":"The Good, The Bad, And The Ugly","isPresale":0},{"movie_id":"M_005","movie_name":"Citizen Kane 2","isPresale":1}]}
router.get("/", checkUserId, cache("2 minutes"), movieController.getAllMovies);

// Returns:
// {"success":true,"data":{"movie_id":"M_005","movie_name":"Citizen Kane 2","isPresale":1}}
router.get("/:movie_id", checkUserId, movieController.getOneMovie);

// Returns:
// {"success":true,"data":[{"theatre_id":"T_001","theatre_name":"MovieTown NE","showing_id":"ST_006","movie_id":"M_005","show_time":"2022-12-13T16:00:00.000Z","movie_name":"Citizen Kane 2","isPresale":1}]}
router.get(
  "/:movie_id/theatre",
  checkUserId,
  movieController.getTheatreForMovie
);

// Returns:
// {"success":true,"data":[{"showing_id":"ST_006","theatre_id":"T_001","movie_id":"M_005","show_time":"2022-12-13T16:00:00.000Z","theatre_name":"MovieTown NE","movie_name":"Citizen Kane 2","isPresale":1}]}
router.get(
  "/:movie_id/showing",
  checkUserId,
  movieController.getShowingForMovie
);

module.exports = router;
