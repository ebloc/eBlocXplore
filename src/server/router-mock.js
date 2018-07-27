const express = require('express');
const utils = require('./utils');

const { blocks, txData, blockWithTxs, accountTxs } = require('./utils/mock');

const router = express.Router();
const { bc } = utils;

router.get('/blocks', async (req, res) => {
  res.send(blocks);
});

router.get('/txs', async (req, res) => {
  res.send(txData);
});

router.get('/blocks/:number', async (req, res) => {
  res.send(blockWithTxs);
});

router.get('/txs/:hash', async (req, res) => {
  res.send(txData.txs[0]);
});

router.get('/accounts/:account/txs', async (req, res) => {
  res.send(accountTxs);
});

router.get('/accounts/:account/balance', async (req, res) => {
  res.send('6134300000000000');
});

router.get('/search/:query', utils.wrap(async (req, res) => {
  const { query } = req.params;
  let type;

  if (web3.utils.isAddress(query)) {
    type = 'account';
  } else if (bc.isBlockNumber(query)) {
    type = `block`;
  } else {
    return res.sendStatus(404);
  }
  res.send({ type });
}));

module.exports = router;
