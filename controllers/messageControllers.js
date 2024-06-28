const { Op } = require('sequelize');

const Messages = require('../models/messages');

exports.sendMessage = async (req, res, next) => {
  try {
    const { message, groupId } = req.body
    const response = await Messages.create(
      { message, userId: req.user.id, userName: req.user.name, groupId }
    );

    res.status(201).json({ message: 'Message sent successfully!!', response })
  } catch (err) {
    console.log('Something went wrong!!', err)
    res.status(500).json({ message: 'Something went wrong!!', details: err })
  }
}

exports.getMessages = async (req, res, next) => {
  try {
    const { groupId, messageId } = req.query

    const messages = await Messages.findAll(
      {
        where: {
          groupId,
          id: {
            [Op.gt]: messageId || 0
          },
        }
      }
    )

    res.status(200).json(messages);
  } catch (err) {
    console.log('Something went wrong!!', err)
    res.status(500).json({ message: 'Something went wrong!!', details: err })
  }
}
