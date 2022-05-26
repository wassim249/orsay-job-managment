const express = require("express");
const app = express();
require("dotenv").config();
const authRouter = require("./routes/auth");
const scanRouter = require("./routes/scan");
const userRouter = require("./routes/user");
const orderRouter = require("./routes/order");
const statsRouter = require("./routes/stats");
const searchRouter = require("./routes/search");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/scan", scanRouter);
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/stats", statsRouter);
app.use("/api/search", searchRouter);

const PORT = process.env.PORT || 5000;

// run server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
