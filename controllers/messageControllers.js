const Messages = require('../models/messages');

exports.sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body
    const response = await Messages.create({ message, userId: req.user.id })
    res.status(201).json({ message: 'Message sent successfully!!', response })
  } catch (err) {
    console.log('Something went wrong!!', err)
    res.status(500).json({ message: 'Something went wrong!!', details: err })
  }
}
