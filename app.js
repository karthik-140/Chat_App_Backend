const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');

const sequelize = require('./util/database');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(helmet());

app.use(bodyParser.json({ extented: false }));

app.use('/user', userRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT);
  }).catch((err) => {
    console.log(err)
  })
