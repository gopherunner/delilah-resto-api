const { Router } = require('express');
const customerRouter = Router();
const { createCustomer, getCustomer, getCustomers, updateCustomer } = require('../db/customers');
const { getCustomerOrders } = require('../db/orders');
const { validateCustomer, isAdmin, authenticateCustomer } = require('./auth');

// Customer login endpoint
customerRouter.post('/login', async (req, res) => {
    const customerLogin = req.body;
    [ customerLogged, token ] = await validateCustomer(customerLogin);
    if (!customerLogged) {
        res.status(400).json({ msg: "Username / email and / or password wrong!" });
        return;
    }
    console.log('[INFO] Logged In successfully from user (' + (customerLogin.username || customerLogin.email) + ') with Token: ' + token);
    res.status(200).json({ msg: 'Logged in successfully', token: token });
});

// Customer register endpoint
customerRouter.post('/register', async (req, res) => {
    const newCustomer = req.body;
    // console.log('Customer New username: ' + req.body.username);
    try {
        const created = await createCustomer(newCustomer);

        if (created) {
            res.status(201).json({ msg: "Customer created successfully. The Customer ID is", data: newCustomer.username });
        } else {
            res.status(401).json({ msg: "Customer already registered", data: newCustomer.username });
        }
    } catch (error) {
        res.status(400).json({ msg: "Error ocurred", data: error.message });
    }
});

// Customer orders endpoint
customerRouter.get('/orders', authenticateCustomer, async (req, res) => {
    const cust = req.customer.customerLogged;
    const ordersFound = await getCustomerOrders(cust);
    if (ordersFound.length != 0) {
        res.status(200).json({ orders: ordersFound });
    } else {
        res.status(400).json({ msg: 'There are no available orders!' });
    }
});

customerRouter.put('/:id', authenticateCustomer, isAdmin, async (req, res) => {
    const customerId = req.params.id;
    const changes = req.body;
    const updated = await updateCustomer(changes, customerId);
    if (updated == 1) {
        res.status(201).json({ msg: `Customer with ID: ${customerId} successfully updated!` });
    } else {
        res.status(400).json({ msg: `There was a problem when trying to update Customer with ID: ${customerId}` });
    }
});

customerRouter.get('/', async (req, res) => {
    try {
        const customers = await getCustomers();

        if (customers) {
            res.status(201).json({ msg: "Customers retrieved successfully", data: customers });
        } else {
            res.status(401).json({ msg: "There was an error while trying to retrieve the Customers" });
        }
    } catch (error) {
        res.status(400).json({ msg: "Error ocurred", data: error.message });
    } 
});

module.exports = customerRouter;
