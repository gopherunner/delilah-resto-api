const { Customer } = require('../models/customers');
const { Sequelize } = require('./connection');
const bcrypt = require('bcrypt');

const Op = Sequelize.Op;

async function getRegisteredCustomer(obj) {
    const { username, email } = obj;

    if (username) {
        let customerFound = await Customer.findOne({
            where: {
                username: username,
            },
        });
        return customerFound;
    }
    if (email) {
        let customerFound = await Customer.findOne({
            where: {
                email: email,
            },
        });
        return customerFound;
    }
    return null;
}

async function getCustomer(username) {
    const customerFound = await Customer.findOne({
        where: {
            username: username
        },
        raw: true
    });
    return customerFound;
}

async function getCustomers() {
    await Customer.findAll()
        .then(customer => {
            return res.status(200).json({ customers: customer });
        })
        .catch(err => {
            return res.status(404).send('ERROR While trying to get Customers from the API');
        })
};

async function checkCustomerUsernameExists(username) {
    try {
        let usernameExists = await Customer.findOne({
            where: {
                username: username,
            },
        });
        if (usernameExists) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }  
}

async function checkCustomerEmailExists(email) {
    try {
        let emailExists = await Customer.findOne({
            where: {
                email: email,
            },
        });
        if (emailExists) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

async function createCustomer(obj) {
    // Check if username is already registered
    let customerUsernameExists = await checkCustomerUsernameExists(obj.username);
    if (customerUsernameExists) {
        return false;
    }

    // Check if email is already registered
    let customerEmailExists = await checkCustomerEmailExists(obj.email);
    if (customerEmailExists) {
        return false;
    }

    console.log("Customer username exists?: " + customerUsernameExists);
    // Hash the Customer password
    const salt = await bcrypt.genSalt(5);
    obj.password = await bcrypt.hash(obj.password, salt);

    const customerCreated = await Customer.create(obj);
    if (customerCreated) {
        return customerCreated.customer_id;
    } else {
        return false;
    }
}

async function updateCustomer(obj, id) {
    const updatedCustomer = await Customer.update(obj, {
        where: {
            customer_id: id,
        },
    });
    return updatedCustomer[0];
}

module.exports = { createCustomer, getRegisteredCustomer, getCustomer, updateCustomer, getCustomers };
