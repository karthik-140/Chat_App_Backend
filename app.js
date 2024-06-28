const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');

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
  origin: 'http://localhost:3000',
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

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

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT);
  }).catch((err) => {
    console.log(err)
  })
