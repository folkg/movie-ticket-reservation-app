const express = require("express");
const checkToken = require("../../auth/token_validation");
const theatreController = require("../../controllers/theatreController");

const router = express.Router();

//TODO: DO we want to add security so normal users can't post/patch/delete? Do we even need to implement those endpoints?

router.get("/", theatreController.getAllTheatres);
router.get("/:theatreId", theatreController.getOneTheatre);
router.post("/", theatreController.createTheatre);
router.patch("/:theatreId", theatreController.updateTheatre);
router.delete("/:theatreId", theatreController.deleteTheatre);
router.get("/:theatreId/movie", theatreController.getMovieForTheatre);
router.get("/:theatreId/showtime", theatreController.getMovieForTheatre);

module.exports = router;
