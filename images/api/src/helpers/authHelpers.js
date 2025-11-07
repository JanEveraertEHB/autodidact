const jwt = require('jsonwebtoken');

const decodeToken = (req, res, next) => {
  const token = req.headers.authorization;
  if(token) {
    const decoded = jwt.verify(token, "weaponofmathdestruction");
    req.user = decoded
    next()
  } else {
    res.send(400)
  }
};

module.exports = { decodeToken};