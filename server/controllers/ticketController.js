const ticketService = require("../services/ticketService");
const constants = require("../config/constants");

const controllerMethods = {};

// pointless method used to boost self esteem!
// Not at all! We'll use this to get all tickets from the user endpoint!
controllerMethods.getAllTickets = async (req, res) => {
  try {
    const { query } = req;
    let results = await ticketService.getAllTickets(query);
    if (results) {
      res.json({ status: true, data: results });
    } else {
      res.status(404).json({ status: false, message: "no tickets found" });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      status: false,
      message: e.message,
    });
  }
};

// creates a ticket. Currently assuming the body will
// consist of the Seat_ID
controllerMethods.createTicket = async (req, res) => {
  try {
    const { body, userId } = req;

    let results = await ticketService.createTicket(body, userId);
    if (results) {
      res.status(201).json({ success: true, data: results });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ success: false, message: e.message });
  }
};

// TODO: CONFIRM: Set up so that the admin fee is not applied if the user logged in is registered OR if the user_id in the database is tied to a registered user.
// this means that a registered user can cancel a ticket without logging in, and someone can recieve the reg user perk if they bought a ticket when they were
// a regular user and have since become registered.

controllerMethods.cancelTicketById = async (req, res) => {
  try {
    const { body } = req;
    const isRegisteredUser = req.userId != null;
    let results = await ticketService.cancelTicketById( body, isRegisteredUser);
    res.json({ success: true, data: results });
    
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      res.status(400).json({
      success: false,
      message: "Ticket has already been cancelled.",
  });
    } else {
      res.status(500).json({success: false, message: e.message});
    }
  }
};

module.exports = controllerMethods;
