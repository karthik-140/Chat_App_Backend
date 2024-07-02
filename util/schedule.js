const Messages = require('../models/messages');
const ArcheivedChats = require('../models/archeivedChats');

exports.moveChatsToArchivedChats = async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const messages = await Messages.findAll({ where: { createdAt: { [sequelize.Op.lte]: oneDayAgo } } });

    await ArcheivedChats.bulkCreate(messages);
    const chatIds = ArcheivedChats.map((chat) => chat.id)
    await Messages.destroy({ where: { id: chatIds } }, { truncate: true });
  } catch (error) {
    console.log(error);
  }
} 
