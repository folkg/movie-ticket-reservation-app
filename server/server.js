const express = require("express");
require("dotenv").config();
// const cors = require("cors");

const v1UserRouter = require("./v1/routes/userRoutes");
const v1MovieRouter = require("./v1/routes/movieRoutes");
const v1TheatreRouter = require("./v1/routes/theatreRoutes");
const v1TicketRouter = require("./v1/routes/ticketRoutes");
const v1ShowingRouter = require("./v1/routes/showingRoutes");


const app = express();
const PORT = process.env.APP_PORT || 5000;

app.use(express.json());
// app.use(cors());

app.use("/api/v1/user", v1UserRouter);
app.use("/api/v1/movie", v1MovieRouter);
app.use("/api/v1/theatre", v1TheatreRouter);
app.use("/api/v1/ticket", v1TicketRouter);
app.use("/api/v1/showings", v1ShowingRouter);


app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});

