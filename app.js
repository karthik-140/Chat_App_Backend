const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');

const sequelize = require('./util/database');
const Users = require('./models/users');
const Messages = require('./models/messages');

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(helmet());

app.use(bodyParser.json({ extented: false }));

app.use('/user', userRoutes);
app.use('/messages', messageRoutes);

Users.hasMany(Messages);
Messages.belongsTo(Users);

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT);
  }).catch((err) => {
    console.log(err)
  })
