const { getProductsById } = require('./products');
const { getCustomer } = require('./customers');
const Moment = require('moment');
const { Order } = require('../models/orders');
const { Product } = require('../models/products');
const { OrderDetail } = require('../models/orders_details');
const moment = Moment();

function getProductsId(products) {
    let productsId = [];
    products.forEach(product => {
        const id = product.product_id;
        productsId.push(id);
    });
    return productsId;
}

function getProductsPrices(products, quantities) {
    const arr = [];
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const price = product.product_price;
        const qty = quantities.find(element => element.product_id == product.product_id).product_qty;
        const productTotal = price * qty;
        arr.push(productTotal);
    }
    return arr;
}

function getTotalProductPrice(prices) {
    let total = 0;
    prices.forEach(price => {
        total += price;
    });
    total = (Math.round(total * 100) / 100).toFixed(2);
    return total;
}

async function getAllOrders() {
    const ordersFound = await Order.findAll({
        include: [
            {
                model: Product,
                through: {
                    as: 'orders_details',
                    attributes: ['product_qty']
                }
            }
        ],
    });
    return ordersFound;
};

async function getCustomerOrders(customer) {
    const cust = await getCustomer(customer);
    const custId = cust.customer_id;
    const custOrders = await Order.findAll({
        include: [
            {
                model: Product,
                through: {
                    as: 'orders_details',
                    attributes: ['product_qty']
                }
            }
        ],
        where: {
            customer_id: custId
        }
    });
    return custOrders;
};

async function getOrderById(id) {
    const retrievedOrder = await Order.findOne({
        where: {
            order_id: id
        },
        raw: true
    });
    if (!retrievedOrder) {
        throw new Error("[ERROR] Non-existent Order (" + retrievedOrder.order_id + ") ");
    }
    return retrievedOrder;
};

async function createOrder(order, username) {
    const productsId = getProductsId(order.products);
    try {
        const orderProducts = await getProductsById(productsId);
        const productsPrices = getProductsPrices(orderProducts, order.products);
        const productTotal =  getTotalProductPrice(productsPrices);
        console.log("[DEBUG] - Customer Username: " + username);
        const customerLogged = await getCustomer(username);
        const orderDate = moment.format('YYYY-MM-DD HH:mm:ss');
        console.log("[DEBUG] - Products IDs: " + orderProducts);
        console.log("[DEBUG] - Product Prices: " + productsPrices);
        console.log("[DEBUG] - Product Total: " + productTotal);
        console.log("[DEBUG] - Customer: " + customerLogged);
        console.log("[DEBUG] - Order Date: " + orderDate);
        const newOrder = {
            order_total: productTotal,
            order_status: "new",
            payment_method: order.payment_method,
            address: customerLogged.address,
            customer_id: customerLogged.customer_id,
            order_time: orderDate
        };
        const orderCreated = await Order.create(newOrder);
        const newOrderId = orderCreated.order_id;
        console.log("[DEBUG] - Order created successfully with ID: " + newOrderId);
        // Insert OrderDetails
        const orderProductsCreated = insertOrderProducts(newOrderId, order.products);
        console.log("[DEBUG] - Order Details created successfully! " + orderProductsCreated);
        return (orderCreated);
    } catch (err) {
        return err.message;
    }
};

function insertOrderProducts(id, products) {
    const productsCreated = products.map(product => {
        const productId = product.product_id;
        const productQty = product.product_qty;
        const productCreated = {
            product_id: productId,
            order_id: id,
            product_qty: productQty
        };
        return productCreated;
    });
    OrderDetail.bulkCreate(productsCreated);
    return productsCreated;
};

async function updateOrder(id, settings) {
    try {
        const updated = await Order.update(settings, {
            where: {
                order_id: id
            }
        });
        return updated[0];
    } catch (err) {
        return err.message;
    }
};

async function deleteOrder(id) {
    try {
        const orderDeleted = await OrderDetail.destroy({
            where: {
                order_id: id
            }
        });
        console.log("[DEBUG] => Order Detail Deleted: " + orderDeleted);
        if (orderDeleted != 0) {
            const deleted = await Order.destroy({
                where: {
                    order_id: id
                }
            });
            return deleted;
        } else {
            throw new Error('Order cant be deleted!');
        }
    } catch (err) {
        return err.message;
    }
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, getCustomerOrders };
