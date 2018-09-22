/* eslint-disable no-console */
const path = require('path');
const Web3 = require('web3');
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const net = require('net');

const router = require('./router');
const routerMock = require('./router-mock');

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
  let web3 = new Web3();

  // // in order to debug transactions
  web3.extend({
    property: 'debug',
    methods: [{
      name: 'traceTransaction',
      call: 'debug_traceTransaction',
      params: 2,
      inputFormatter: [web3.extend.inputTransactionFormatter, null],
    }],
  });

  do {
    try {
      web3.setProvider(new Web3.providers.HttpProvider(process.env.GETH_RPC));
      var isListening = await web3.eth.net.isListening();
    } catch (err) {
      console.error(err.message, ' Retrying again in 1 sec');
      await new Promise(res => setTimeout(res, 1000));
    }
  } while (!isListening);
  console.log('Connected to ethereum network');

  return web3;
};

/**
 * init mongo db
 */
exports.initDB = async () => {
  // await new Promise(res => setTimeout(res, 10000));
  let db;
  do {
    try {
      const mongoConn = await mongodb.MongoClient.connect(process.env.MONGODB_URL);
      db = mongoConn.db(process.env.NETWORK_NAME);
    } catch (err) {
      console.error(err.message, ' Retrying again in 1 sec');
      await new Promise(res => setTimeout(res, 1000));
    }
  } while (!db);
  console.log(`Connected to database ${process.env.MONGODB_URL}`);
  return db;
};

exports.start = async () => {
  app = express();

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json());

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    next();
  });

  app.use(express.static(path.join(__dirname, '../../dist')));
  app.use('/api', router);
  app.use('/apiMock', routerMock);
  app.use((req, res) => res.sendFile(path.join(__dirname, '../../dist/index.html')));

  server = app.listen(process.env.PORT);
  server.on('error', (err) => {
    console.error(err);
  });

  console.log(`App listening at http://localhost:${process.env.PORT}`);
};

exports.restart = async () => {
  console.log('Restarting app');
  await server.close();
  await exports.start();
};
