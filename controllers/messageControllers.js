const { Op } = require('sequelize');
const { uploadToS3 } = require('../services/s3Services');

const Messages = require('../models/messages');
const sequelize = require('../util/database');

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

exports.uploadFile = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    const { file } = req
    const { groupId } = req.query

    if (!file) {
      return res.status(404).json({ message: 'Bad request', success: false });
    }
    const fileUrl = await uploadToS3(file, file.originalname);
    // console.log('fileUrl--->', fileUrl)
    const response = await Messages.create(
      { message: fileUrl, userId: req.user.id, userName: req.user.name, groupId },
      { transaction: t }
    );

    await t.commit()
    res.status(201).json({ message: 'Message sent successfully!!', response, fileUrl })
  } catch (err) {
    await t.rollback()
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
