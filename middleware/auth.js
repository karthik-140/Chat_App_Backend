const jwt = require('jsonwebtoken');

const Users = require('../models/users');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET_TOKEN)
    // console.log('verifiedUser--->', verifiedUser)

    const user = await Users.findByPk(verifiedUser.userId)
    // console.log('user--->', user)

    req.user = user
    next()
  } catch (err) {
    console.log('Something went wrong!!', err);
    res.status(401).json({ message: 'user not authorized!!', success: false })
  }
}

module.exports = {
  authenticate,
}
