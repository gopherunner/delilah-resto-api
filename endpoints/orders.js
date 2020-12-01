const { Router } = require('express');
const ordersRouter = Router();
const { authenticateCustomer, isAdmin } = require('./auth');
const { createOrder, getAllOrders, updateOrder, deleteOrder, getOrderById } = require('../db/orders');

ordersRouter.use(authenticateCustomer);

// Create an Order
ordersRouter.post('/', async (req, res) => {
    const order = req.body;
    console.log("[DEBUG] - createOrder Body.payments_method: " + order.payment_method);
    if (order.payment_method === 'cash' || order.payment_method === 'credit card' || order.payment_method === 'debit card') {
        if (order.payment_method === undefined || order.products === undefined) {
            res.status(400).json({ msg: 'The request has missing information needed to create the Order' });
        }
        console.log("[DEBUG] - customerLogged: " + order.username);
        const orderCreated = await createOrder(order, order.username);
        res.status(201).json({ data: orderCreated });
    } else {
        res.status(400).json({ err: 'Payment Method is incorrect' });
    }
});

// Get all Orders
ordersRouter.get('/', isAdmin, async (req, res) => {
    try {
        const orders = await getAllOrders();
        if (orders.length != 0) {
            res.status(200).json({ orders: orders });
        } else {
            res.status(404).json({ msg: 'There are no available orders' });
        }
    } catch (err) {
        res.status(400).json({ msg: 'There was a problem while getting the Orders', error: err.message });
    }
});

// Get specific Order
ordersRouter.get('/:id', isAdmin, async (req, res) => {
    try {
        const orderId = req.params.id;
        const orderFound = await getOrderById(orderId);
        if (orderFound) {
            res.status(200).json({ order: orderFound });
        }
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// Update an Order
ordersRouter.put('/:id', isAdmin, async (req, res) => {
    const updOrder = req.body;
    const orderId = req.params.id;
    console.log("[DEBUG] - Order ID: " + orderId);
    try {
        const orderUpdated = await updateOrder(orderId, updOrder);
        if (orderUpdated == 1) {
            console.log("[INFO] Order ID: " + orderId + ", updated successfully!");
            res.status(201).json({ msg: `Order ID: ${orderId}, updated successfully!` });
        } else {
            console.log("[ERROR] There was a problem while trying to Update the Order with ID: " + orderId);
            res.status(400).json({ msg: `There was a problem while trying to Update the Order with ID: ${orderId}`});
        }
    } catch (err) {
        console.log("[ERROR] There was a problem while trying to fetch Order from the database with ID: " + orderId);
        res.status(400).json({ msg: `There was a problem while trying to fetch Order from the database with ID: ${orderId}` });
    }
});

// Delete an Order
ordersRouter.delete('/:id', isAdmin, async (req, res) => {
    const orderId = req.params.id;
    const orderDeleted = await deleteOrder(orderId);
    if (orderDeleted == 1) {
        console.log("[INFO] Order with ID " + orderId + ", successfully deleted!");
        res.status(200).json({ msg: `Order with ID ${orderId}, successfully deleted!` });
    } else {
        console.log("[ERROR] There was an error while trying to Delete Order with ID " + orderId);
        res.status(400).json({ msg: `There was an error while trying to Delete Order with ID ${orderId}` });
    }
});

module.exports = ordersRouter;
