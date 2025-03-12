const jwt = require('jsonwebtoken');
const { JWT_USER_SECRET } = require('../config');

const userAuth = (req, res, next) => {
    const token = req.headers['token']

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_USER_SECRET);
        req.user_Id = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = userAuth;
