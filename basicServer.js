/* global require, __dirname, console */

/* eslint-disable import/no-extraneous-dependencies, no-console */

const express = require('express');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const morgan = require('morgan');
// eslint-disable-next-line import/no-unresolved
const N = require('./nuve');
const fs = require('fs');
const https = require('https');
// eslint-disable-next-line import/no-unresolved
const config = require('./licode_config');

const options = {
  // key: fs.readFileSync('../../cert/key.pem').toString(),
  // cert: fs.readFileSync('../../cert/cert.pem').toString(),
};
const defaultRoomName = 'basicExampleRoom';
if (config.erizoController.sslCaCerts) {
  options.ca = [];
  config.erizoController.sslCaCerts.forEach((cert) => {
    options.ca.push(fs.readFileSync(cert).toString());
  });
}

const app = express();

// app.configure ya no existe
app.use(errorhandler({
  dumpExceptions: true,
  showStack: true,
}));
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/licode/', (req, res) => {
  const  svckey = req.body.svckey;
  const  svcid = req.body.svcid;
  var    url = req.body.url;
  url =  "http://"+url+"/"
  N.API.init(svckey, svcid, url);
  res.send("ok");
});

app.get('/getRooms/', (req, res) => {
  N.API.getRooms((rooms) => {
    res.send(rooms);
  });
});

app.get('/getUsers/:room', (req, res) => {
  const room = req.params.room;
  N.API.getUsers(room, (users) => {
    res.send(users);
  });
});

app.post('/createToken/', (req, res) => {
  console.log('Creating token. Request body: ', req.body);
  const username = req.body.username;
  const role = req.body.role;

  let room = defaultRoomName;
  let type;
  let roomId;
  let mediaConfiguration;

  if (req.body.room) room = req.body.room;
  if (req.body.type) type = req.body.type;
  if (req.body.roomId) roomId = req.body.roomId;
  if (req.body.mediaConfiguration) mediaConfiguration = req.body.mediaConfiguration;

  const createToken = (tokenRoomId) => {
    N.API.createToken(tokenRoomId, username, role, (token) => {
      console.log('Token created', token);
      res.send(token);
    }, (error) => {
      console.log('Error creating token', error);
      res.status(401).send('No Erizo Controller found');
    });
  };

  if (roomId) {
    createToken(roomId);
  } else {
    getOrCreateRoom(room, type, mediaConfiguration, createToken);
  }
});


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
  res.header('Access-Control-Allow-Headers', 'origin, content-type');
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

let port = 3001;
let tlsPort = 3004;
if (config.basicExample && config.basicExample.port) {
  port = config.basicExample.port;
}
if (config.basicExample && config.basicExample.tlsPort) {
  tlsPort = config.basicExample.tlsPort;
}
app.listen(port);
const server = https.createServer(options, app);
console.log('BasicExample started');
server.listen(tlsPort);
