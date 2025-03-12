
const { User, brandpage, product } = require('../db/db');module.exports.recommendProducts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userInteractions = {
            interests: user.intrest, // User's interests (e.g., hashtags they like)
            favoriteBrands: user.favouriteBrand, // Brand the user favors
            reviews: user.reviews // Products the user has reviewed
        };

        // Fetch all products and brands
        const allProducts = await product.find({});
        const allBrands = await brandpage.find({});

        // Scoring function based on interactions
        const calculateScore = (product) => {
            let score = 0;

            // Increment score if the product belongs to a favorite brand
            if (userInteractions.favoriteBrands && userInteractions.favoriteBrands.includes(product.creatorId)) {
                score += 20;
            }

            // Increase score for matching hashtags with user interests
            if (product.hashtags && userInteractions.interests) {
                product.hashtags.forEach((tag) => {
                    if (userInteractions.interests.includes(tag)) {
                        score += 10;
                    }
                });
            }

            // Increase score if the product has received positive reviews from the user
            if (userInteractions.reviews && userInteractions.reviews.includes(product._id)) {
                score += 15;
            }

            // Increment score based on product popularity (likes, shares, etc.)
            score += (product.itemAnalytical.likes * 0.5) + (product.itemAnalytical.share * 0.3) + (product.itemAnalytical.reviews * 0.2);

            return score;
        };

        // Rank products by score
        const rankedProducts = allProducts.map((product) => {
            return {
                product,
                score: calculateScore(product)
            };
        }).sort((a, b) => b.score - a.score);

        // Respond with top ranked products
        res.status(200).json({
            message: "Personalized product recommendations",
            products: rankedProducts.map(ranked => ranked.product)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
