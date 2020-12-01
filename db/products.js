const { Product } = require('../models/products');
const { Order } = require('../models/orders');
const { Sequelize } = require('./connection');

async function getProducts() {
    try {
        const retrievedProducts = await Product.findAll();
        return retrievedProducts;
    } catch (err) { 
        throw new Error(err.message);
    }
};

async function getProductsById(products) {
    const retrievedProducts = await Product.findAll({
        where: {
            product_id: products
        },
        raw: true,
        rejectOnEmpty: true
    });
    if (retrievedProducts.length < products.length) {
        throw new Error("[ERROR] Check the product IDs");
    }
    return retrievedProducts;
};

async function getProductById(id) {
    const productById = await Product.findOne({
        where: {
            product_id: id
        },
        raw: true
    });
    if (!productById) {
        throw new Error("[ERROR] Non-existent Product (" + productById.product_name + ") ");
    }
    return productById;
};

async function createProduct(obj) {
    let newProduct = obj;
    try {
        newProduct = await Product.create(obj);
    } catch (err) {
        throw new Error(err.message);
    }
    return newProduct;
};

async function updateProduct(obj, id) {
    try {
        const productUpdated = await Product.update(obj, {
            where: {
                product_id: id
            },
        });
        return productUpdated;
    } catch (err) {
        throw new Error(err.message);
    }
};

async function checkIfProductExistsInOrder(id) {
    const productFound = await Product.findOne({
        include: [
            {
                model: Order,
                through: {
                    as: 'orders_details',
                    attributes: ['product_id']
                }
            }
        ],
        where: {
            product_id: id
        },
        raw: true
    });
    return productFound;
};

async function deleteProduct(id) {
    try {
        const deletedProduct = await Product.destroy({
            where: {
                product_id: id
            },
        });
        return deletedProduct;
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = { deleteProduct, updateProduct, createProduct, getProductById, getProductsById, getProducts, checkIfProductExistsInOrder };
