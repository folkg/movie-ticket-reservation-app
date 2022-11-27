const express = require("express");
const { checkToken } = require("../../auth/token_validation");
const userController = require("../../controllers/userController");

const router = express.Router();

// NOTE: The JWT token is returned in the JSON body when a user logs in.
// In order to access any of the APIs behind the 'checkToken' method, the
// user needs to include that token in the header of the request {headers: { Authorization: `JWT ${jwt}` },}

//NOTE: By using the 'checkToken' function as middleware, it checks whether a user is logged in adds the userId to to req.userId if they are
// If the user is not logged in, it will deny them access to use that endpoint.

router.get("/", userController.getAllUsers); // in theory this should probably be an admin function, but leaving it open for now
router.get("/:userId", checkToken, userController.getOneUser); // use checkToken to ensure user is logged in as the correct user to perform update
router.post("/", userController.createUser);
router.patch("/:userId", checkToken, userController.updateUser); // use checkToken to ensure user is logged in as the correct user to perform update
router.delete("/:userId", checkToken, userController.deleteUser); // use checkToken to ensure user is logged in as the correct user to perform update

// Expects:
// {"email_address": "rperson@ucalgary.ca","password": "1234"}
// Returns:
// {"success":true,"message":"Login successful.","user_id":"U_0001","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVXzAwMDEiLCJpYXQiOjE2Njk1ODI2NTR9.haVvegionYEQ0PEXLhSiBJVatrJusLtAj24b2L7ywc8"}
module.exports = router;
