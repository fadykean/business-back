const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('jwtKey'));
    console.log({ decoded });
    req.user = decoded;
    console.log('before next');
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}