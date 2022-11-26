const express = require("express");
const checkToken = require("../../auth/token_validation");
const apicache = require("apicache");
const movieController = require("../../controllers/movieController");

const router = express.Router();
// Added cache in just for fun.
const cache = apicache.middleware;

//TODO: How to use checkToken to ensure user gets to see presale movies?
//TODO: DO we want to add security so normal users can't post/patch/delete? Do we even need to implement those endpoints?

router.get("/", cache("2 minutes"), movieController.getAllMovies);
router.get("/:movieId", movieController.getOneMovie);
router.post("/", movieController.createMovie);
router.patch("/:movieId", movieController.updateMovie);
router.delete("/:movieId", movieController.deleteMovie);
router.get("/:movieId/theatre", movieController.getTheatreForMovie);
router.get("/:movieId/showtime", movieController.getShowTimeForMovie);

module.exports = router;
