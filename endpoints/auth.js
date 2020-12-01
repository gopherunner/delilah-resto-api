const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { getRegisteredCustomer, getCustomer } = require('../db/customers');

const jwtSignature = process.env.APP_SECRET;

async function validateCustomer(customer) {
    const validatedCustomer = await getRegisteredCustomer(customer);
    if (!validatedCustomer) {
        return [null];
    }

    // Check if password is valid
    let passwordOk = await bcrypt.compare(
        customer.password,
        validatedCustomer.password
    );
    if (!passwordOk) {
        console.log("Password entered is not correct");
        return [null];
    }

    // Generate the token
    const customerLogged = validatedCustomer.username;
    const token = jwt.sign({
       customerLogged
    }, jwtSignature, { expiresIn: "1h",});
    return [ customerLogged, token ];
};

// Authenticate the Customers token
function authenticateCustomer(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const authenticated = jwt.verify(token, jwtSignature);
        if (authenticated) {
            req.customer = authenticated;
            return next();
        } else {
            console.log("[DEBUG] - Error while trying to authenticate the Customer token");
        }
    } catch (err) {
        res.status(403).send(`Error while validating Customer: ${err.message}`);
    }
};

// Check that the customer has admin privileges
async function isAdmin(req, res, next) {
    const { customerLogged } = req.customer;
    const { is_admin } = await getCustomer(customerLogged);
    if (is_admin) {
        return next();
    } else {
        res.status(403).json({ msg: "You don't have Admin permissions" });
        return false;
    }
};

module.exports = { validateCustomer, authenticateCustomer, isAdmin };


