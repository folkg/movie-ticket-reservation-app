const userService = require("../services/userService");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

const controllerMethods = {};

controllerMethods.getAllUsers = async (req, res) => {
  try {
    let results = await userService.getAllUsers();
    if (results) {
      res.json({ success: true, data: results });
    } else res.json({ success: false, message: "No users found." });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

controllerMethods.getOneUser = async (req, res) => {
  try {
    const { userId } = req.params;
    let results = await userService.getOneUser(userId);
    if (results) res.json({ success: true, data: results });
    else res.json({ success: false, message: "No user found." });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

controllerMethods.createUser = async (req, res) => {
  try {
    const { body } = req;
    if (
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.password ||
      !body.address ||
      !body.creditCard
    )
      res.status(400).json({
        success: false,
        message: "Not all required properties have been provided.",
      });
    // encrypt password
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    let results = await userService.createUser(body);
    res.status(201).json({ success: true, data: results });
  } catch (e) {
    //check the error code coming back from MySQL
    if (e.code === "ER_DUP_ENTRY")
      res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    else {
      console.log(e.message);
      res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }
};

controllerMethods.updateUser = async (req, res) => {
  try {
    const { body } = req;
    const { userId } = req.params;
    if (
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.password ||
      !body.address ||
      !body.creditCard ||
      !userId
    )
      res.status(400).json({
        success: false,
        message: "Not all required properties have been provided.",
      });
    // encrypt password
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    let results = await userService.updateUser(body, userId);
    if (results) res.json({ success: true, data: results });
    else res.json({ success: false, data: "No user found." });
  } catch (e) {
    //check the error code coming back from MySQL
    if (e.code === "ER_DUP_ENTRY")
      res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    else {
      console.log(e.message);
      res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }
};

controllerMethods.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    let results = await userService.deleteUser(userId);
    if (results) res.json({ success: true, message: "Delete successful." });
    else res.json({ success: false, data: "No user found." });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

controllerMethods.login = async (req, res) => {
  try {
    const { body } = req;
    let results = await userService.getUserByEmail(body);
    if (!results)
      res.json({ success: false, data: "Invalid email or password." });
    else {
      const result = compareSync(body.password, results.password);
      if (result) {
        results.password = undefined; // don't pass user password in
        const jsontoken = sign({ result: results }, process.env.JWT_KEY);
        res.json({
          success: true,
          message: "login successful.",
          token: jsontoken,
        });
      } else {
        res.json({
          success: false,
          message: "Invalid email or password.",
        });
      }
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
