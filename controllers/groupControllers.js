const sequelize = require('../util/database');
const Groups = require('../models/groups');
const UserGroups = require('../models/userGroups');

exports.createGroup = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { groupName, selectedUsers } = req.body;

    const group = await Groups.create({ groupName }, { transaction: t });

    const groupMembers = selectedUsers.map((user) => {
      return { groupId: group.id, userId: user.id, userName: user.name }
    });

    const addedGroupUsers = await UserGroups.bulkCreate(
      [{ isAdmin: true, groupId: group.id, userId: req.user.id, userName: req.user.name }, ...groupMembers],
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ message: 'Group created successfully!!', groupName, users: addedGroupUsers })

  } catch (err) {
    t.rollback();
    console.log('Something went wrong!!', err)
    res.status(500).json({ message: 'Something went wrong!!', details: err })
  }
}

exports.getAllGroups = async (req, res, next) => {
  try {
    const allGroups = await req.user.getGroups()

    res.status(200).json(allGroups)
  } catch (err) {
    console.log('Something went wrong!!', err)
    res.status(500).json({ message: 'Something went wrong!!', details: err })
  }
}

exports.getAllGroupDetails = async (req, res, next) => {
  try {
    const { groupId } = req.params

    const group = await UserGroups.findAll({ where: { groupId } })

    res.status(200).json(group)
  } catch (err) {
    console.log('Something went wrong!!', err)
    res.status(500).json({ message: 'Something went wrong!!', details: err })
  }
}

exports.addUsersToGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params
    const selectedUsers = req.body

    const groupMembers = selectedUsers.map((user) => {
      return { groupId, userId: user.id, userName: user.name }
    });

    const response = await UserGroups.bulkCreate(groupMembers)
    res.status(200).json({ message: 'Users added to group successfully!!', response })
  } catch (err) {
    console.log('Something went wrong!!', err)
    res.status(500).json({ message: 'Something went wrong!!', details: err })
  }
}

exports.removeUserFromGroup = async (req, res, next) => {
  try {
    const { groupId, userId } = req.query

    const response = await UserGroups.destroy({
      where: {
        groupId, userId
      }
    })

    if (!response) {
      return res.status(404).json({ success: false })
    }

    console.log(groupId, userId, 'response--->', response)
    res.status(200).json({ message: 'User removed successfully!!', success: true })
  } catch (err) {
    console.log('Something went wrong!!', err)
    res.status(500).json({ message: 'Something went wrong!!', details: err })
  }
}

exports.makeUserIsAdmin = async (req, res, next) => {
  try {
    const { groupId, userId } = req.query

    const response = await UserGroups.update(
      { isAdmin: true },
      {
        where: {
          groupId, userId
        }
      })

    if (!response) {
      return res.status(404).json({ message: 'Bad request!!', success: false })
    }

    console.log(groupId, userId, 'response--->', response)
    res.status(200).json({ message: 'Marked user is admin successfully!!', response })
  } catch (err) {
    console.log('Something went wrong!!', err)
    res.status(500).json({ message: 'Something went wrong!!', details: err })
  }
}

exports.existFromGroup = async (req, res, next) => {
  try {
    const { groupId } = req.query
    const userId = req.user.id

    const response = await UserGroups.destroy({
      where: {
        groupId, userId
      }
    })

    if (!response) {
      return res.status(404).json({ success: false })
    }

    console.log(groupId, userId, 'response--->', response)
    res.status(200).json({ message: 'Group exit successfully!!', success: true })
  } catch (err) {
    console.log('Something went wrong!!', err)
    res.status(500).json({ message: 'Something went wrong!!', details: err })
  }
}
