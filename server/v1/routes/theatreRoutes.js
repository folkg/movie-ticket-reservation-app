const express = require("express");
const { checkUserId } = require("../../auth/token_validation");
const theatreController = require("../../controllers/theatreController");

const router = express.Router();

//TODO: Do we even need to implement the post/patch/delete endpoints? Likely only required if we had Admin users.

//NOTE: By using the 'checkUserId' function as middleware, it checks whether a user is logged in and adds the userId to to req.userId if they are
// This can be used to determine whether to return presale movies with the response

router.get("/", theatreController.getAllTheatres);
router.get("/:theatreId", theatreController.getOneTheatre);
router.post("/", theatreController.createTheatre);
router.patch("/:theatreId", theatreController.updateTheatre);
router.delete("/:theatreId", theatreController.deleteTheatre);
router.get(
  "/:theatreId/movie",
  checkUserId,
  theatreController.getMovieForTheatre
);
router.get(
  "/:theatreId/showtime",
  checkUserId,
  theatreController.getMovieForTheatre
);

module.exports = router;
