const jwt = require('jsonwebtoken');
const { JWT_CREATOR_SECRET } = require('../config');

const creatorAuth = (req, res, next) => {
    const token = req.headers['token']

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_CREATOR_SECRET);
        req.creator = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = creatorAuth;
