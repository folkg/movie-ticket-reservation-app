const express = require("express");
const checkToken = require("../../auth/token_validation");
const userController = require("../../controllers/userController");

const router = express.Router();

//TODO: How to use checkToken to ensure it is the specified user?

router.get("/", userController.getAllUsers);
router.get("/:userId", userController.getOneUser);
router.post("/", userController.createUser);
router.patch("/:userId", checkToken, userController.updateUser); // use checkToken to ensure user is logged in to perform updates
router.delete("/:userId", checkToken, userController.deleteUser); // use checkToken to ensure user is logged in to perform updates
router.post("/login", userController.login);

module.exports = router;
