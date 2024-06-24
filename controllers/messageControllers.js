const { Op, where } = require('sequelize');

const Messages = require('../models/messages');

exports.sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body
    const response = await Messages.create({ message, userId: req.user.id, userName: req.user.name })
    res.status(201).json({ message: 'Message sent successfully!!', response })
  } catch (err) {
    console.log('Something went wrong!!', err)
    res.status(500).json({ message: 'Something went wrong!!', details: err })
  }
}

exports.getMessages = async (req, res, next) => {
  try {
    const { messageId } = req.query

    // console.log(`messageId-->${Math.random()}--->`, messageId)
    const messages = await Messages.findAll(
      messageId && {
        where: {
          id: {
            [Op.gt]: messageId
          }
        }
      }
    )
    // console.log('messages--->', messages)
    res.status(200).json(messages);
  } catch (err) {
    console.log('Something went wrong!!', err)
    res.status(500).json({ message: 'Something went wrong!!', details: err })
  }
}
