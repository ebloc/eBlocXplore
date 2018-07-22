/* eslint-disable no-console */
const path = require('path');
const Web3 = require('web3');
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const net = require('net');

let app; // express application
let server; // http server

exports.initGlobals = () => {
  // collect environment variables from .env file
  require('dotenv').config(); // eslint-disable-line import/no-extraneous-dependencies, global-require
};

/**
 * init blockhain and web3
 * @return {Web3}
 */
exports.initBlockchain = async () => {
  const ipcFile = path.join(__dirname, `../../blockchain/${process.env.NETWORK_NAME}/geth.ipc`);
  const web3 = new Web3(ipcFile, net);

  // in order to debug transactions
  web3.extend({
    property: 'debug',
    methods: [{
      name: 'traceTransaction',
      call: 'debug_traceTransaction',
      params: 2,
      inputFormatter: [web3.extend.inputTransactionFormatter, null],
    }],
  });

  if (!web3.eth.net.isListening()) {
    console.error('Cannot connect to ethereum network'); // eslint-disable-line no-console
  } else {
    console.log('Connected to ethereum network'); // eslint-disable-line no-console
  }

  return web3;
};

/**
 * init mongo db
 */
exports.initDB = async () => {
  const mongoConn = await mongodb.MongoClient.connect(process.env.MONGODB_URL);
  db = mongoConn.db(process.env.NETWORK_NAME);
  console.log(`Connected to database ${process.env.MONGODB_URL}`); // eslint-disable-line no-console
  return db;
};

exports.start = async () => {
  app = express();
  const router = require('./router');

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json());

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    next();
  });

  app.use(router);

  server = app.listen(process.env.PORT);
  server.on('error', (err) => {
    console.error(err);
  });

  console.log(`App listening at http://localhost:${process.env.PORT}`); // eslint-disable-line no-console
  // if (args.cron) {
  //   crons.start();
  //   console.log('Crons started'); // eslint-disable-line no-console
  // }
};

exports.restart = async () => {
  console.log('Restarting app');
  await server.close();
  await exports.start();
};
