const Sequelize = require('sequelize');
const db = require('../db/connection');

const Customer = db.sequelize.define('customers', {
        customer_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "The username can't be empty",
                },
            },
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "The password can't be empty",
                },
            },
        },
        fullname: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "The fullname can't be empty",
                },
            },
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Address can't be empty",
                },
            },
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: {
                    args: true,
                    msg: "Enter a valid email",
                },
            },
        },
        phone_number: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    args: true,
                    msg: "The phone number can only contain numbers",
                },
            },
        },
        is_admin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    },
);

module.exports = { Sequelize, Customer };
