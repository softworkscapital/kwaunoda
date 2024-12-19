const express = require('express');
require('dotenv').config();
const cors = require('cors');

const https = require('https');

const path = require('path');
const fs = require('fs');

// Route path
const userRouter = require('./routes/users');
const clientRouter = require('./routes/client_profile');
const funnelConRouter = require('./routes/funnel_conversation');
const prospectsRouter = require('./routes/prospect_details');
const costCenterRouter = require('./routes/cost_center');
const accountInfoRouter = require('./routes/account_info');
const accountLinkingRouter = require('./routes/account_linking');
const expensesAccRouter = require('./routes/expensesAcc');
const accountMapRouter = require('./routes/account_map');
const cashBankRouter = require('./routes/cash_bank');
const directExpensesRouter = require('./routes/direct_expenses');
const projectRouter = require('./routes/projects');
const incomeRouter = require('./routes/income');
const capitalAccRouter = require('./routes/capitalacc');

//REMS BUSINESS SUITE PROFESSIONAL POS / TILL POINT
//const branchRouter = require('./routes_pos/branches');
const currencyRouter = require('./routes_pos/currency');
const salesPricesRouter = require('./routes_pos/sales_prices');
const saleRecordRouter = require('./routes_pos/sale_records');
const productDefinitionRouter = require('./routes_pos/product_definition');
const inventoryMgtRouter = require('./routes_pos/inventorymgt');
const shiftRouter = require('./routes_pos/shift');
const shiftBalancesRouter = require('./routes_pos/shiftbalances');
const CustomerRouter = require('./routes_pos/customer_details');
const pettyCashRouter = require('./routes_pos/pettycash');
const saleListRouter = require('./routes_pos/salelist');
const salesInvoiceRouter = require('./routes_pos/sales_invoices');
const quotationProformaInvoiceRouter = require('./routes_pos/quotation_profoma_invoices');




// REMS GAS
const paymentRouter = require('./routes_gas_ecosystem/payments');
const salesShiftPosGasRouter = require('./routes_gas_ecosystem/sales_shift');
const branchesRouter = require('./routes_gas_ecosystem/branchz');
const InventoryRouter = require('./routes_gas_ecosystem/inventory');
const productRouter = require('./routes_gas_ecosystem/products');
const mkt_place_paymentRouter = require('./routes_gas_ecosystem/mkt_place_payments');
const salesPriceRouter = require('./routes_gas_ecosystem/sales_prices');


const app = express();
app.use(express.json());
app.use(cors());

//App Route Usage
app.use('/users', userRouter);
app.use('/clients', clientRouter);
app.use('/funnelcon', funnelConRouter);
app.use('/prospects', prospectsRouter);
app.use('/costcenter', costCenterRouter);
app.use('/accountinfo', accountInfoRouter);
app.use('/accountlinking', accountLinkingRouter);
app.use('/expensesacc', expensesAccRouter);
app.use('/directexpenses', directExpensesRouter);
app.use('/accountmap', accountMapRouter);
app.use('/cashbank', cashBankRouter);
app.use('/projects', projectRouter);
app.use('/income', incomeRouter);
app.use('/capitalacc', capitalAccRouter);

//POS Route Usage
//app.use('/branches', branchRouter);
app.use('/currency', currencyRouter);
app.use('/salesprice', salesPricesRouter);
app.use('/salerecords', saleRecordRouter);
app.use('/productdefinition', productDefinitionRouter);
app.use('/inventorymgt', inventoryMgtRouter);
app.use('/shift', shiftRouter);
app.use('/shiftbalances', shiftBalancesRouter);
app.use('/customers', CustomerRouter);
app.use('/pettycash', pettyCashRouter);
app.use('/salelist', saleListRouter);
//app.use('/saleshift', saleshiftRouter);

//Gas
app.use('/payments', paymentRouter);
app.use('/salesshiftgas', salesShiftPosGasRouter);
app.use('/branches', branchesRouter);
app.use('/inventory', InventoryRouter);
app.use('/products', productRouter);
app.use('/mkt_place_payments', mkt_place_paymentRouter);
app.use('/salesprices', salesPriceRouter);
app.use('/sales_invoices', salesInvoiceRouter);
app.use('/quotationprofomainvoices', quotationProformaInvoiceRouter);


app.get('/', (req, res) => {
    res.send("REMS ECOSYSTEM");
})

// const options = {
//   cert: fs.readFileSync('/etc/letsencrypt/live/srv547457.hstgr.cloud/fullchain.pem'),
//   key: fs.readFileSync('/etc/letsencrypt/live/srv547457.hstgr.cloud/privkey.pem')
// };

// https.createServer(options, app).listen(process.env.APPPORT || '3009', () => {
//   console.log('app is listening to port' + process.env.APPPORT);
// });

 app.listen(process.env.APPPORT || '3009', () => {
     console.log('app is listening to port' + process.env.APPPORT);
 });