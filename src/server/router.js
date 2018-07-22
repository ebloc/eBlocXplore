const express = require('express');
const utils = require('./utils');

const router = express.Router();
const { bc } = utils;

/**
 * returns requested blocks
 * if starting block is not specified returns the last {length} blocks
 * @param {number} start starting block number
 * @param {number} length @default 25
 * @return {[Block]} blocks
 */
router.get('/blocks', async (req, res) => {
  const lastBlockNum = await web3.eth.getBlockNumber();
  let length = Number(req.query.length) || 25;
  let start = Number(req.query.start) || (lastBlockNum - length);

  // range validations
  if (length > 100) length = 100;
  if (start < 0) start = 0;
  if (start + length > lastBlockNum) length = lastBlockNum - start;

  const blocks = await bc.getBlocks(start, length);
  res.send(blocks);
});

/**
 * returns requested txs
 * if starting txs is not specified returns the last {length} txs
 * @param {number} start starting tx index
 * @param {number} length @default 25
 * @return {object} {start: number, length: number, txs: [Tx]}
 */
router.get('/txs', async (req, res) => {
  const lastTxNum = await bc.getLastTxNumber();
  let length = Number(req.query.length) || 25;
  let start =  Number(req.query.start) || (lastTxNum - length);

  // range validations
  if (length > 100) length = 100;
  if (start < 0) start = 0;
  if (start + length > lastTxNum) length = lastTxNum - start;

  const txs = await bc.getTxs(start, length);
  res.send({
    start,
    length,
    txs
  });
});

/**
 * @param {number} number block nunmber or hash
 * @return {Block}
 */
router.get('/blocks/:number', async (req, res) => {
  try {
    const block = await web3.eth.getBlock(req.params.number, true);
    res.send(block);
  } catch (error) {
    res.sendStatus(404);
  }
});

/**
 * @param {hash} hash tx hash
 * @return {Tx}
 */
router.get('/txs/:hash', async (req, res) => {
  try {
    const tx = await web3.eth.getTransaction(req.params.hash, true);
    res.send(tx);
  } catch (error) {
    res.sendStatus(404);
  }
});

/**
 * get previous txs of an account, last 25 ones if options not specified
 *
 * @param {account} account tx hash
 * @param {number} start @default 'last'
 * @param {number} length @default 25
 * @return {object} {total: number, start: number, length: number, txs: [Tx]}
 */
router.get('/accounts/:account/txs', async (req, res) => {
  try {
    const account = req.params.account;
    const total = await bc.getTxCountByAccount(account);
    let length = Number(req.query.length) || 25;
    // by default get last {length} txs
    let start = (!req.query.start || req.query.start === 'last')
      ? total - length
      : Number(req.query.start);

    // range validations
    if (length > 100) length = 100;
    if (start < 0) start = 0;
    if (start + length > total) length = total - start;

    const txs = await bc.getTxsByAccount(account, start, length);
    res.send({ total, start, length, txs });
  } catch (error) {
    res.sendStatus(404);
  }
});

/**
 * get balance of an account
 *
 * @param {account} account tx hash
 * @return {number} in eth
 */
router.get('/accounts/:account/balance', async (req, res) => {
  try {
    const balance = await web3.eth.getBalance(req.params.account);
    res.send(web3.utils.fromWei(balance, 'ether'));
  } catch (error) {
    res.sendStatus(404);
  }
});

/**
 * search for block|address|tx
 *
 * @param {string} query block number, address or hash
 * @return {string} search type
 */
router.get('/search/:query', utils.wrap(async (req, res) => {
  const { query } = req.params;
  let type;

  if (web3.utils.isAddress(query)) {
    type = 'account';
  } else if (bc.isBlockNumber(query)) {
    type = `block`;
  } else if (bc.isHash(query)) {
    if (await web3.eth.getTransaction(query)) {
      type = 'tx';
    } else if (await web3.eth.getBlock(query)) {
      type = 'block';
    }
  } else {
    return res.sendStatus(404);
  }
  res.send({ type });
}));

router.get('/internal-txs/:address', utils.wrap(async (req, res) => {
  if (!await bc.isContract(req.params.address)) return res.sendStatus(400);
  const txs = await bc.getTxsWithInternals(req.params.address);
  res.send(txs);
}));

module.exports = router;
