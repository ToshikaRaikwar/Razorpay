// server/index.js (or server.js)

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const paymentRoutes = require("./routes/payment");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
