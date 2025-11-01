const http = require('http');
const express = require('express');
const { createServer } = require('http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const jwt = require('jsonwebtoken');
const cors = require("cors")

const { checkBodyFields } =require("./helpers/bodyHelpers");
const { uuidv4 } =require("./helpers/uuidHelpers");
const pg = require('./db/db.js')

const student_routes = require('./students')
const action_routes = require('./actions')

const { init } = require('./socket');

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

app.use('/students', student_routes);
app.use('/actions', action_routes);

app.get('/', (req, res) => {
  res.send("hello world")
})


init(server)





module.exports = server;