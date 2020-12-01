const Sequelize = require('sequelize');
const db = require('../db/connection');
const { Customer } = require('./customers');
const { Product } = require('./products');
const { OrderDetail } = require('./orders_details');

const Order = db.sequelize.define('orders', {
    order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Customer,
            key: 'customer_id',
        },
    },
    order_status: {
        type: Sequelize.ENUM('new','confirmed','preparing','delivering','delivered'),
        allowNull: false,
        defaultValue: 'new',
    },
    order_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: true,
    },
    payment_method: {
        type: Sequelize.ENUM('cash','credit card', 'debit card'),
        allowNull: false,
    },
    order_total: {
        type: Sequelize.DECIMAL(7,2),
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

Order.belongsTo(Customer, { foreignKey: 'customer_id' });
Order.belongsToMany(Product, { through: OrderDetail, foreignKey: 'order_id' });
Product.belongsToMany(Order, { through: OrderDetail, foreignKey: 'product_id' });
Customer.hasMany(Order, { foreignKey: 'customer_id' });

module.exports = { Sequelize, Order};
