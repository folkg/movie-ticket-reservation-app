const DatabaseConnection = require("../config/database");

class userPayment {

    connection;
    refundService;
    seatService;
    paymentService;

    constructor() {
        this.connection = DatabaseConnection.getInstance().getConnection();
        this.refundService = require("../services/refundService");
        this.seatService = require("../services/seatService");
        this.paymentService = require("../services/paymentService");
    }

    pay  = ( req ) => {}

}

module.exports = userPayment;