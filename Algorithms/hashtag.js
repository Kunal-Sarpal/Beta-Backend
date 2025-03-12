const { Product } = require('../db/db'); // Ensure this points to the correct product model
const { User } = require('../db/db'); // Import user model
const { UserScore } = require('../db/db'); // Import UserScore model

module.exports.hashtagAlgo = async (req, res) => {
    try {
        const userId = req.user_Id; // Ensure you are using the correct user ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userInterests = user.intrest || []; // Ensure this field is correct

        // Fetch all products from the database
        const products = await Product.find({});

        // Rank products based on their calculated score
        const rankedProducts = await Promise.all(products.map(async (prod) => {
            // Check if the user score already exists for this product
            let userScore = await UserScore.findOne({ userId, productId: prod._id });

            if (!userScore) {
                userScore = new UserScore({ userId, productId: prod._id });
            }

            // Calculate the score for this product based on user interests
            const score = calculateScore(prod, userInterests);

            // Update the user's score
            userScore.score += score; // Increment the score
            await userScore.save(); // Save the updated score

            return {
                product: prod,
                score: userScore.score // Get the updated user-specific score
            };
        }));

        // Separate products into those with scores > 0 and those with scores = 0
        const highScoringProducts = rankedProducts.filter(ranked => ranked.score > 0);
        const lowScoringProducts = rankedProducts.filter(ranked => ranked.score <= 0);

        // Sort high scoring products by score in descending order
        highScoringProducts.sort((a, b) => b.score - a.score);

        // Combine both lists: first high scoring products, then low scoring products
        const combinedProducts = [
            ...highScoringProducts,
            ...lowScoringProducts
        ];

        // Respond with the combined list of ranked products
        res.status(200).json({
            message: "Products ranked by relevance",
            products: combinedProducts.map(ranked => ranked.product) // Send only the product details
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to calculate a matching score for products based on hashtags and user interests
const calculateScore = (product, userInterests) => {
    let score = 0;

    // Check if the product has hashtags
    if (product.hashtags && product.hashtags.length > 0) {
        // Loop through each hashtag in the product
        product.hashtags.forEach((hashtag) => {
            // Increase score if the hashtag matches any of the user's interests
            if (userInterests.includes(hashtag)) {
                score += 10; // Each matching hashtag adds 10 points
                console.log(`Match found! Score increased by 10. Current score: ${score}`);
            } else {
                console.log(`No match for hashtag: ${hashtag}`);
            }
        });
    }

    return score; // Return the calculated score
};
