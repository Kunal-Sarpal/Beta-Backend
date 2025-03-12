const { User, userReccomendScore } = require('../db/db'); // Import the User model and the userReccomendScore model

module.exports.recommendUsers = async (req, res) => {
    try {
        const userId = req.user_Id; // Current user ID from the request
        const currentUser = await User.findById(userId);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userInterests = currentUser.intrest; // Current user's interests

        // Fetch all other users except the current user
        const allUsers = await User.find({ _id: { $ne: userId } });

        // Calculate similarity score for each user
        const calculateuserReccomendScore = (user) => {
            let score = 0;

            // Match based on shared interests
            if (user.intrest && user.intrest.length > 0) {
                user.intrest.forEach(interest => {
                    if (userInterests.includes(interest)) {
                        score += 10; // Increment score for each matching interest
                    }
                });
            }

            // Boost score for mutual followers
            const mutualFollowers = currentUser.following.filter(followedId =>
                user.followers.includes(followedId)
            ).length;
            score += mutualFollowers * 5; // Add points for each mutual follower

            return score;
        };

        // Rank users based on their scores
        const rankedUsers = allUsers.map(async (user) => {
            const score = calculateuserReccomendScore(user);

            // Store score in the database if it doesn't exist already
            if (score > 0) {
                const existingScore = await userReccomendScore.findOne({
                    userId: userId,
                    scoredUserId: user._id
                });

                if (existingScore) {
                    // If score exists, update it
                    existingScore.score = score;
                    await existingScore.save();
                } else {
                    // If no score exists, create a new entry
                    const newuserReccomendScore = new userReccomendScore({
                        userId: userId,
                        scoredUserId: user._id,
                        score: score
                    });
                    await newuserReccomendScore.save();
                }
            }

            return {
                user,
                score
            };
        });

        // Wait for all the user scores to be stored
        const results = await Promise.all(rankedUsers);

        // Sort users by score in descending order
        results.sort((a, b) => b.score - a.score);

        // Respond with a list of recommended users
        res.status(200).json({
            message: "Recommended users",
            users: results
                .filter(ranked => ranked.score > 0) // Optional: filter out users with score 0
                .map(ranked => ({
                    user: ranked.user,
                    score: ranked.score
                }))
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
