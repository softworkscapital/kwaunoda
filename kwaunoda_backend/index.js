const express = require("express");
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const https = require("https");
const path = require("path");
const fs = require("fs");
require('dotenv').config();
const { Pesepay } = require('pesepay');



const pesepay = new Pesepay(
  process.env.PESEPAY_INTERGRATION_KEY,
  process.env.PESEPAY_ENCRYPTION_KEY
);
const PORT = process.env.APPPORT || 3011;
// Route path
const tripRouter = require("./routes/trip");
const userRouter = require("./routes/users");
const paymentRouter = require("./routes/payments");
const driverRouter = require("./routes/driver");
const customerRouter = require("./routes/customer_details");
const counterRouter = require("./routes/counter_offer");
const complaintRouter = require("./routes/complaint");
const CustomerDriverChatRouter = require("./routes/customer_driver_chats");
const CustomerAdminChatRouter = require("./routes/customer_admin_chats");
const sentMessagesRouter = require("./routes/sent_messages");
const topUpRouter = require("./routes/topUp");
const TarrifRouter = require("./routes/tarrifs");
const CounterOfferRouter = require("./routes/counter_offer");
const DriverAnalyticRouter = require("./routes/driver_analytics");
const TripStatusAnalyticRouter = require("./routes/trip_status_analytics");
const ConfigRouter = require("./routes/application_configs");
const StatisticRouter = require("./routes/application_statistics");
const WithdrawalRouter = require("./routes/application_withdrawals");


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

// Serve uploaded images as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads"; // Directory to save files
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Save with unique name
  },
});

const upload = multer({ storage });

// Endpoint to handle image uploads
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Save the relative path
  const filePath = `/uploads/${req.file.filename}`; // Save relative path
  res.send({ path: filePath }); // Return the relative path
});

// App Route Usage
app.use("/trip", tripRouter);
app.use("/users", userRouter);
app.use("/payments", paymentRouter);
app.use("/driver", driverRouter);
app.use("/customerdetails", customerRouter);
app.use("/counteroffer", counterRouter);
app.use("/complaint", complaintRouter);
app.use("/customer_driver_chats", CustomerDriverChatRouter);
app.use("/customer_admin_chats", CustomerAdminChatRouter);
app.use("/sentmessages", sentMessagesRouter);
app.use("/topUp", topUpRouter);
app.use("/tarrifs", TarrifRouter);
app.use("/counter_offer", CounterOfferRouter);
app.use("/driver_analytics", DriverAnalyticRouter);
app.use("/trip_status_analytics", TripStatusAnalyticRouter);
app.use("/application_configs", ConfigRouter);
app.use("/application_statistics", StatisticRouter);
app.use("/application_withdrawals", WithdrawalRouter);






pesepay.resultUrl = 'https://localhost:3011/payment-result';
pesepay.returnUrl = 'https://192.168.241.97:8081';


app.post('/initiate-payment', async (req, res) => {
  const { currencyCode, paymentMethodCode, customerEmail, customerPhone, customerName, amount, paymentReason } = req.body;

  const transaction = pesepay.createTransaction(amount, currencyCode, paymentReason);
  
  try {
      const response = await pesepay.initiateTransaction(transaction);
      console.log("our response", response);

      if (response.success) {
          const redirectUrl = response.redirectUrl;
          return res.json({ success: true, redirectUrl });
      } else {
          return res.status(400).json({ success: false, message: response.message });
      }
  } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



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
