const { Creator, brandpage } = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signup = async (req,res,next)=>{
    try {
        const {
            username,
            email,
            password,
            creatorFirstName,
            creatorLastName,
            brandType,
            gstNumber,
            address,
            contactNumber
        } = req.body;

        // Check if creator already exists
        const existingCreator = await Creator.findOne({ username });
        if (existingCreator) {
            return res.status(400).json({
                msg: "Creator Already Exists"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create new creator
        const newCreator = await Creator.create({
            username,
            email,
            password: hashedPassword, // Use the hashed password
            creatorFirstName,
            creatorLastName,
            brandType,
            gstNumber,
            address,
            contactNumber
        });

        // Create JWT token
        const token = jwt.sign({ id: newCreator._id }, JWT_CREATOR_SECRET, { expiresIn: '2h' }); // Token valid for 1 hour

        res.status(201).json({
            msg: "Creator created successfully",
            token, // Return the token
            creator: {
                username: newCreator.username,
                email: newCreator.email,
                creatorFirstName: newCreator.creatorFirstName,
                creatorLastName: newCreator.creatorLastName,
                brandType: newCreator.brandType
            }
        });
        next();
    } catch (error) {
        console.error("Creator Signup Error:", error);
        res.status(500).json({
            msg: "Error creating creator",
            error: error.message
        });
        next(error)
    }
}
module.exports.signin = async (req,res,next)=>{
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                msg: "Email and password are required"
            });
        }

        // Find creator by email
        const newcreator = await Creator.findOne({ email });
        if (!newcreator) {
            return res.status(400).json({
                msg: "Invalid email or password"
            });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, newcreator.password);
        if (!isMatch) {
            return res.status(400).json({
                msg: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = jwt.sign({ id: Creator._id }, JWT_CREATOR_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            msg: "Login successful",
            token,
            creator: {
                username: newcreator.username,
                email: newcreator.email,
                creatorFirstName: newcreator.creatorFirstName,
                creatorLastName: newcreator.creatorLastName,
                brandType: newcreator.brandType
            }
        });
        next();
    } catch (error) {
        console.error("Creator Login Error:", error);
        res.status(500).json({
            msg: "Error logging in creator",
            error: error.message
        });
        next(error);
    }
}
module.exports.getProfileCreator = async (req, res, next) => {
    try {
        const creator = await Creator.findById(req.params.id);
        res.status(200).json(creator);
    } catch (error) {
        console.error("Creator Profile Error:", error);
        res.status(500).json({
        
    })}

}
module.exports.createBrandpage = async (req, res, next) => {
    try {
        const {
            creatorId,
            creatorBrandName,
            creatorBrandDescription,
        } = req.body; // Destructure the request body

        // Create a new brand page with the data from the request body
        const brandpage = await brandpage.create({
            creatorId,
            creatorBrandName,
            creatorBrandDescription,
           
        });

        // Send back the newly created brand page as the response
        res.status(200).json(brandpage);
    } catch (error) {
        next(error); // Pass errors to the next middleware (error handler)
    }
};
