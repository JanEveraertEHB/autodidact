const jwt = require('jsonwebtoken');

const authCheck = (req, res, next) => {
  const auth = req.headers.authorization;
  const decoded = jwt.verify(auth, 'weaponofmathdestruction');
  req.user = decoded
  next()
};

module.exports = { authCheck};