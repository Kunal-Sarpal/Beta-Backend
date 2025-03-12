const { User, Product, Comment,Review, Creator } = require("../db/db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signup =  async (req, res) => {
    try {
        const { email, password, firstname, lastname, mobilenumber, intrest } = req.body;

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                msg: "User Already Exists"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create new user
        const newUser = await User.create({
            email,
            password: hashedPassword, // Use the hashed password
            firstname,
            lastname,
            mobilenumber,
            intrest
        });

        // Create JWT token
        const token = jwt.sign({ id: newUser._id }, JWT_USER_SECRET, { expiresIn: '1h' }); // Token valid for 1 hour

        res.status(201).json({
            msg: "User created successfully",
            token, // Return the token
            user: {
                email: newUser.email,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                mobilenumber: newUser.mobilenumber,
                hashedPassword: hashedPassword
            }
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({
            msg: "Error creating user",
            error: error.message
        });
    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: "Invalid email or password"
            });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                msg: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, JWT_USER_SECRET, { expiresIn: '1h' }); // Token valid for 1 hour

        res.status(200).json({
            msg: "Login successful",
            token, // Return the token
            user: {
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                password: user.password
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            msg: "Error logging in",
            error: error.message
        });
    }
}

module.exports.getProfileCreatorForUser = async (req, res, next) => {
    try {
        const creator = await Creator.findById(req.params.id);
        res.status(200).json(creator);
    } catch (error) {
        console.error("Creator Profile Error:", error);
        res.status(500).json({

        })
    }

}

module.exports.like = async (req, res) => {
    const { productId } = req.params;
    const { userId } = req.body; // Ensure `userId` is passed in the request body

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the user has already liked the product
        const hasLiked = product.itemAnalytical.likes.some(like => like.userId.toString() === userId);

        if (hasLiked) {
            return res.status(400).json({ message: 'User has already liked this product' });
        }

        // Add the like if the user has not liked the product yet
        product.itemAnalytical.likes.push({ userId, timestamp: new Date() });
        await product.save();

        res.status(201).json({ message: 'Product liked', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.comment = async (req, res) => {
    const { productId } = req.params;
    const { userId, commentText } = req.body;

    try {
        const newComment = new Comment({
            productId,
            userId,
            commentText
        });

        await newComment.save();

        await Product.findByIdAndUpdate(productId, {
            $push: { comments: newComment._id }
        });

        res.status(201).json({ message: 'Comment added successfully', newComment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.review = async (req, res) => {
    const { productId } = req.params;
    const { userId, reviewText, rating } = req.body;

    try {
        const newReview = new Review({
            productId,
            userId,
            reviewText,
            rating
        });

        await newReview.save();

        await Product.findByIdAndUpdate(productId, {
            $push: { reviews: newReview._id }
        });

        res.status(201).json({ message: 'Review added successfully', newReview });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

