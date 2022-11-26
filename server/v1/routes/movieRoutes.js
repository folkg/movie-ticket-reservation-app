const express = require("express");
const { checkUserId } = require("../../auth/token_validation");
const apicache = require("apicache");
const movieController = require("../../controllers/movieController");

const router = express.Router();
// Added cache in just for fun.
const cache = apicache.middleware;

//TODO: Do we even need to implement the post/patch/delete endpoints? Likely only required if we had Admin users.

//NOTE: By using the 'checkUserId' function as middleware, it checks whether a user is logged in and adds the userId to to req.userId if they are
// This can be used to determine whether to return presale movies with the response

router.get("/", checkUserId, cache("2 minutes"), movieController.getAllMovies);
router.get("/:movieId", checkUserId, movieController.getOneMovie);
router.post("/", movieController.createMovie);
router.patch("/:movieId", movieController.updateMovie);
router.delete("/:movieId", movieController.deleteMovie);
router.get(
  "/:movieId/theatre",
  checkUserId,
  movieController.getTheatreForMovie
);
router.get(
  "/:movieId/showtime",
  checkUserId,
  movieController.getShowTimeForMovie
);

module.exports = router;
