const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../db/db'); // Ensure your User model is correctly imported

const userRouter = express.Router();
const { JWT_USER_SECRET } = require('../config');
const { getProducts } = require('../controllers/product.controller');
const {  getProfileCreator } = require('../controllers/creator.controller');
const { hashtagAlgo } = require('../Algorithms/hashtag');
const userAuth = require('../middleware/userAuth');

const { signup, login, like, comment, review } = require('../controllers/user.controller');
const { recommendUsers } = require('../Algorithms/userRec');

// Route to check if the server is working
userRouter.get("/", (req, res) => {
    res.send("Working");
});

// Signup userRouter
userRouter.post("/signup", signup);

// Login userRouter
userRouter.post("/login", login);

// // Get creator profile
// userRouter.get("/getProfile/:id", getProfile);

// Based on hashtagAlgo, show data to user
userRouter.get("/show_data", userAuth, hashtagAlgo);

// Get Profile of Creator for User
userRouter.get("/getProfileCrUser/:id", userAuth, getProfileCreator);

// User can like
userRouter.post("/product/:productId/like", userAuth, like);

// User can add a comment
userRouter.post("/product/:productId/comment", userAuth, comment);

// User can add a review
userRouter.post("/product/:productId/review", userAuth, review);

// User Recommendation algorithm
userRouter.post("/reccomenduser", userAuth, recommendUsers);

module.exports = userRouter; // Corrected export
