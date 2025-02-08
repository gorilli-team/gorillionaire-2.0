const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    if (!req.header('Authorization')) throw new Error('Missing Authorization header');

    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;

    next();
  } catch (err) {
    res.status(401).send({ error: err.toString() });
  }
};

auth.mobileAppAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const user = await User.findById(token);

    if (!user) {
      throw new Error('Invalid access token ', token);
    }

    req.userId = user.id;

    next();
  } catch (e) {
    res.status(401).send({ error: e.toString() });
  }
};

module.exports = auth;
