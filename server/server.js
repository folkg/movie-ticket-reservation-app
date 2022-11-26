const express = require("express");
require("dotenv").config();
// const cors = require("cors");

const v1UserRouter = require("./v1/routes/userRoutes");

const app = express();
const PORT = process.env.APP_PORT || 5000;

app.use(express.json());
// app.use(cors());

app.use("/api/v1/user", v1UserRouter);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
