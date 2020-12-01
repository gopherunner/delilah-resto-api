const Sequelize = require('sequelize');
const db = require('../db/connection');

const Product = db.sequelize.define('products', {
    product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    product_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    product_detail: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    product_price: {
        type: Sequelize.DECIMAL(7,2),
        allowNull: false,
    },
    product_photo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: true,
        allowNull: false,
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
});

module.exports = { Sequelize, Product };
