const express = require('express');
require('dotenv').config();
const cors = require('cors');


const https = require('https');

const path = require('path');
const fs = require('fs');

const PORT = process.env.APPPORT || 3003
// Route path
const tripRouter = require('./routes/trip');
const userRouter = require('./routes/users');
const paymentRouter = require('./routes/payments');
const driverRouter = require('./routes/driver');
const customerRouter = require('./routes/customer_details');
const counterRouter = require('./routes/counter_offer');
const pool = require('./cruds/poolfile')


const app = express();
app.use(express.json());
app.use(cors());

//App Route Usage
app.use('/trip', tripRouter);
app.use('/users', userRouter);
app.use('/payments', paymentRouter);
app.use('/driver', driverRouter);
app.use('/customerdetails', customerRouter);
app.use('/counteroffer', counterRouter);


app.get('/', (req, res) => {
    res.send("Kwaunoda");
})

// const options = {
//   cert: fs.readFileSync('/etc/letsencrypt/live/srv547457.hstgr.cloud/fullchain.pem'),
//   key: fs.readFileSync('/etc/letsencrypt/live/srv547457.hstgr.cloud/privkey.pem')
// };

// https.createServer(options, app).listen(process.env.APPPORT || '3009', () => {
//   console.log('app is listening to port' + process.env.APPPORT);
// });

app.listen(PORT, () => {
    console.log('app is listening to port' + ' ' + PORT);
});