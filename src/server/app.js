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
  global.web3 = web3;

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
  global.db = mongoConn.db(process.env.NETWORK_NAME);
  console.log(`Connected to database ${process.env.MONGODB_URL}`); // eslint-disable-line no-console
};

exports.start = async () => {
  app = express();

  // @todo delete probably
  // if (process.env.NODE_ENV !== 'production') {
  //   // refresh browser
  //   require('reload')(app);
  // }

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '../client')));
  // 3rd party libraries @TODO: use webpack
  app.use('/jquery', express.static(path.join(__dirname, '../../node_modules/jquery/dist/')));
  app.use('/popper.js', express.static(path.join(__dirname, '../../node_modules/popper.js/dist/')));
  app.use('/bootstrap', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist/')));
  app.use('/font-awesome', express.static(path.join(__dirname, '../../node_modules/font-awesome')));
  app.use('/datatables.net', express.static(path.join(__dirname, '../../node_modules/datatables.net/js/')));
  app.use('/datatables.net-bs4', express.static(path.join(__dirname, '../../node_modules/datatables.net-bs4/')));

  app.use('/api', require('./api-router'));

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
  server.close();
  await exports.start();
};



