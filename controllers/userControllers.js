const bcrypt = require('bcrypt');

const Users = require('../models/users');

exports.signupUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds)

    const existingUser = await Users.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists!!' })
    }

    const user = await Users.create({ name, email, phone, password: hashPassword })
    res.status(201).json({ message: 'User sign-up successful!!', user });

  } catch (err) {
    console.log('Something went wrong!!', err)
    res.status(500).json({ message: 'Something went wrong!!', details: err })
  }
}
