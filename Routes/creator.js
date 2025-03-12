const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Creator, product, Product } = require('../db/db'); // Ensure your Creator model is correctly imported

const creatorAuth = require("../middleware/creatorAuth")
const creatorRoute = express.Router();
const {JWT_CREATOR_SECRET} = require("../config"); // Replace with your own secret key
const { signup, signin, createBrandpage } = require('../controllers/creator.controller');
const { createProduct, updateHashtag, getProducts, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');

// Route to check if the server is working
creatorRoute.get("/", (req, res) => {
    res.send("Creator route working");
});

// Creator Signup Route
creatorRoute.post("/signup",signup);

// Creator Login Route
creatorRoute.post("/signin",signin);

// create Product
creatorRoute.post('/createProduct', creatorAuth,createProduct)


// Get all Products
creatorRoute.get('/products',creatorAuth,getProducts);

// Create Brandpage
creatorRoute.get('/createBrandpage', creatorAuth, createBrandpage);

// Get a single Product by ID
creatorRoute.get('/products/:id',creatorAuth, getSingleProduct);

// Update a Product
creatorRoute.put('/products/:id/update', creatorAuth,updateProduct);

// Delete a Product
creatorRoute.delete('/products/:id/delete', creatorAuth, deleteProduct);

module.exports = creatorRoute;
