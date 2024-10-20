const express = require("express");
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");

const https = require("https");

const path = require("path");
const fs = require("fs");

const PORT = process.env.APPPORT || 3011;
// Route path
const tripRouter = require("./routes/trip");
const userRouter = require("./routes/users");
const paymentRouter = require("./routes/payments");
const driverRouter = require("./routes/driver");
const customerRouter = require("./routes/customer_details");
const counterRouter = require("./routes/counter_offer");
const complaintRouter = require("./routes/complaint");
const pool = require("./cruds/poolfile");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*", // Adjust this to your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
// Increase the limit for JSON and URL-encoded data
app.use(bodyParser.json({ limit: "100mb" })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

//App Route Usage
app.use("/trip", tripRouter);
app.use("/users", userRouter);
app.use("/payments", paymentRouter);
app.use("/driver", driverRouter);
app.use("/customerdetails", customerRouter);
app.use("/counteroffer", counterRouter);
app.use("/complaint", complaintRouter);

app.get("/", (req, res) => {
  res.send("Kwaunoda");
});

app.post("/driver/login", async (req, res) => {
  const { email, password } = req.body;

  // Fetch the user from the database
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = result.rows[0];

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Compare the hashed password
  if (user.password === password) {
    // Assuming user.password is already hashed
    return res.json({
      account_type: user.account_type,
      message: "Login successful",
    });
  } else {
    return res.status(400).json({ message: "Invalid password" });
  }
});

const options = {
  cert: fs.readFileSync('/etc/letsencrypt/live/srv547457.hstgr.cloud/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/srv547457.hstgr.cloud/privkey.pem')
};

https.createServer(options, app).listen(process.env.APPPORT || '3011', () => {
  console.log('app is listening to port' + process.env.APPPORT);
});

// app.listen(PORT, () => {
//   console.log("app is listening to port" + " " + PORT);
// });
