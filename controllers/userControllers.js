const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const Users = require('../models/users');
const jwtServices = require('../services/jwtServices');

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

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found!!' })
    }

    const decodedPassword = await bcrypt.compare(password, user.password)
    if (!decodedPassword) {
      return res.status(403).json({ message: 'User not authorized!!' })
    }

    res.status(200).json({
      message: 'User login successful',
      user,
      token: jwtServices.generateAccessToken(user.id, user.name)
    })
  } catch (err) {
    console.log('Something went wrong!!', err)
    res.status(500).json({ message: 'Something went wrong!!', details: err })
  }
}

exports.getAllGroupUsers = async (req, res, next) => {
  try {
    const users = await Users.findAll({
      where: {
        id: {
          [Op.ne]: req.user.id
        }
      }
    });

    res.status(200).json(users);
  } catch (err) {
    console.log('Something went wrong!!', err)
    res.status(500).json({ message: 'Something went wrong!!', details: err })
  }
}

