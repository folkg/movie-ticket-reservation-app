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
// TODO: Confirm if this is the case.
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
// TODO: Currently adding to the credit entity, should this be sent to the credit controller?

controllerMethods.cancelTicketById = async (req, res) => {
  try {
    const { ticket_id } = req.body;
    // Get details about the ticket:
    let ticket = await ticketService.getTicketById(ticket_id);
    const { user_id, seat_id, cost, show_time } = ticket[0];

    const isRegisteredUser = req.userId != null || user_id != null;
    //If showtime is < 72 hours away cannot let user cancel.
    if (!canCancel(show_time))
      res.json({
        success: false,
        message: "Showtime is in less than 72 hrs. Cannot Cancel.",
      });
    else {
      let credit = cost;
      const expiration_date = getExpirationDate();
      // Apply admin fee if the user is not registered.
      if (!isRegisteredUser) credit = cost * (1 - constants.ADMIN_FEE);
      let results = await ticketService.cancelTicketById(
        ticket_id,
        seat_id,
        credit, 
        expiration_date
      );
      res.json({ success: true, data: results });
    }
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

// canCancel checks the difference between the current time and the
// showtime. Returns true if the distance is >= 72 hours else returns
// false.
function canCancel(show_time) {
  // Add UTC OFFSET to compensate for Mountain Standard Time.
  let show_time_date = new Date(new Date(show_time) + constants.UTC_OFFSET);
  let current_date = new Date();
  difference = show_time_date.getTime() - current_date.getTime();
  hours = difference / (1000 * 3600);
  let cancel;
  hours >= 72 ? (cancel = true) : (cancel = false);
  return cancel;
}


function getExpirationDate(){
  let current_date = new Date();
  let exp_time = current_date.getTime() + constants.EXPIRATION_PERIOD;
  return new Date(exp_time);
}