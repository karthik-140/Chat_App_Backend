const jwt = require('jsonwebtoken');

const generateAccessToken = (id, name) => {
  return jwt.sign({ userId: id, name }, process.env.JWT_SECRET_TOKEN)
}

module.exports = {
  generateAccessToken,
}
