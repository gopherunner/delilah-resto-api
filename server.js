const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
require('dotenv').config();

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

// Import endpoints
const customers = require('./endpoints/customers');
const products = require('./endpoints/products');
const orders = require('./endpoints/orders');

const app = express();

var corsOptions = {
    origin: "http://localhost:" + process.env.APP_PORT
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Init database
const db = require("./db/connection");

console.log("[INFO] Connecting to the Database (" + db.db + ") on port " + db.port + "...")
db.init()
.then(async () => {
    console.log("[INFO] Connection established!");
    
    // Start server only if DB was started correctly 
    app.listen(process.env.APP_PORT,() => {
        console.log("[INFO] Starting Delilah Resto API Server, listening on port " + process.env.APP_PORT);
    });

}).catch((err) => {
	console.log("[ERROR] While trying to connect to the Database", err);
});


// Main endpoint
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Delilah Resto API" });
});

// Doc endpoint
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Customer endpoint
app.use('/customers', customers);
app.use('/products', products);
app.use('/orders', orders);
