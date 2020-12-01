const { Router } = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../db/products');
const productRouter = Router();
const { isAdmin, authenticateCustomer } = require('./auth');

productRouter.use(authenticateCustomer);

// Get Products endpoint
productRouter.get('/', async (req, res) => {
    const { customerLogged } = req.customer;
    console.log(customerLogged);
    try {
        const products = await getProducts();
        res.status(200).json({ products: products });
    } catch (err) {
        res.status(500).json({ err: 'There was an error while getting the Products' });
    } 
});

// Get Product by ID endpoint
productRouter.get('/:id', async (req, res) => {
    try {
        const product_id = req.params.id;
        const productFound = await getProductById(product_id);
        res.status(200).json({ data: productFound });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// Create Product endpoint
productRouter.post('/', isAdmin, async (req, res) => {
    try {
        const newProduct = req.body;
        const nProduct = await createProduct(newProduct);
        res.status(201).json({ product_id: nProduct.product_id });
    } catch (err) {
        res.status(400).json({ msg: 'Error while creating the Product: ' + err.message });
    }
});

// Update Product endpoint
productRouter.put('/:id', isAdmin, (req, res) => {
    try {
        const product_id = req.params.id;
        const updated = updateProduct(req.body, product_id);
        res.status(201).json({ msg: 'Product modified successfully! ' + updated });
    } catch (err) {
        res.status(404).json({ msg: 'Error while updating the Product: ' + err.message });
    }
});

// Delete Product endpoint
productRouter.delete('/:id', isAdmin, async (req, res) => {
    try {
        const product_id = req.params.id;
        const deleted = await deleteProduct(product_id);
        if (deleted == 1) {
            console.log("[DEBUG] => Product with Id: " + product_id + " Deleted Successfully!");
            res.status(200).json({ msg: 'Product deleted successfully! (Id: ' + product_id + ')'});
        } else {
            throw new Error("Error while trying to delete the Product");
        }
    } catch (err) {
        res.status(404).json({ msg: 'Error while deleting the Product: ' + err.message });
    }
});

module.exports = productRouter;
