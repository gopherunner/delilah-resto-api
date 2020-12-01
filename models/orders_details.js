const Sequelize = require('sequelize');
const db = require('../db/connection');
const { Product } = require('./products');
const { Order } = require('./orders');

const OrderDetail = db.sequelize.define('orders_details', {
    order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Order,
            key: 'order_id',
        },
    },
    product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Product,
            key: 'product_id',
        },
    },
    product_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = { OrderDetail };
