const { instrument } = require('@socket.io/admin-ui');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io')
const cron = require('node-cron');

const schedule = require('./util/schedule');
const sequelize = require('./util/database');
const Users = require('./models/users');
const Messages = require('./models/messages');
const Groups = require('./models/groups');
const UserGroups = require('./models/userGroups');

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const groupRoutes = require('./routes/group');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_HOST,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_HOST,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on('connection', (socket) => {
  socket.on('send-message', (message, userGroupInfo) => {
    const groupId = userGroupInfo?.groupId
    if (!groupId) {
      socket.broadcast.emit('receive-message', (message))
    } else {
      socket.to(groupId).emit('receive-message', ({ ...userGroupInfo, message }))
    }
  })

  socket.on('join-group', (groupId) => {
    socket.join(groupId)
  })
})

app.use(helmet());

app.use(bodyParser.json({ extented: false }));

app.use('/user', userRoutes);
app.use('/messages', messageRoutes);
app.use('/group', groupRoutes);

Users.hasMany(Messages);
Messages.belongsTo(Users);

Groups.hasMany(Messages);
Messages.belongsTo(Groups);

Groups.belongsToMany(Users, { through: UserGroups });
Users.belongsToMany(Groups, { through: UserGroups });

instrument(io, { auth: false });

sequelize
  .sync()
  .then(() => {
    server.listen(process.env.PORT);
  }).catch((err) => {
    console.log(err)
  })

cron.schedule('30 2 * * *', schedule.moveChatsToArchivedChats,
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);
