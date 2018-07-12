const express = require('express');
const utils = require('./utils');

const router = express.Router();
const { bc } = utils;

/**
 * returns requested blocks
 * if starting block is not specified returns the last {length} blocks
 * @param {integer} start starting block number
 * @param {integer} length @default 10
 */
router.get('/blocks', async (req, res) => {
  const lastBlockNum = await web3.eth.getBlockNumber();
  let length = Number(req.query.length) || 10;
  let start = Number(req.query.start) || (lastBlockNum - length);

  // range validations
  if (length > 100) length = 100;
  if (start < 0) start = 0;
  if (start + length > lastBlockNum) length = lastBlockNum - start;

  const blocks = await bc.getBlocks(start, length);
  res.send(blocks);
});

/**
 * get last {length} transactions for datatables library
 *
 * query
 * - draw   {integer} chunk index (0)
 * - start  {integer} starting tx number (0)
 * - length {integer} size of the tx chunk (25)
 */
router.get('/datatableTx', async (req, res) => {
  const totalTxNumber = await db.collection('txs').find({}).count();

  const draw = Number(req.query.draw) || 0;
  let start = Number(req.query.start) || 0;
  let length = Number(req.query.length) || 25;

  start = totalTxNumber - start - length;
  // trim out-of-range indices
  if (start < 0) {
    length += start;
    start = 0;
  }
  length = Math.min(length, totalTxNumber - start);

  const txs = (await bc.getTxs(start, length)).reverse();

  res.send({
    draw,
    recordsTotal: totalTxNumber,
    recordsFiltered: totalTxNumber,
    data: txs,
  });
});

/**
 * search for block|address|tx
 *
 * params
 * - query {string} block number, address or hash
 * result
 * - type  {string} block|address|tx
 * - data  {object}
 */
router.get('/search/:query', utils.wrap(async (req, res) => {
  const { query } = req.params;
  let result;

  if (web3.utils.isAddress(query)) {
    result = {
      type: 'address',
      data: {
        address: query,
        isContract: await bc.isContract(query),
        balance: web3.utils.fromWei(await web3.eth.getBalance(query), 'ether'),
        txs: await bc.getTxsByAddress(query),
      },
    };
  } else if (bc.isBlockNumber(query)) {
    const block = await web3.eth.getBlock(query);
    if (block) {
      result = {
        type: 'block',
        data: block,
      };
    }
  } else if (bc.isHash(query)) {
    const tx = await web3.eth.getTransaction(query);
    tx.value = web3.utils.fromWei(tx.value);
    if (tx) {
      result = {
        type: 'tx',
        data: tx,
      };
    }

    const block = await web3.eth.getBlock(query);
    if (block) {
      result = {
        type: 'block',
        data: block,
      };
    }
  }

  if (result) res.send(result);
  else res.sendStatus(404);
}));

router.get('/internal-txs/:address', utils.wrap(async (req, res) => {
  if (!await bc.isContract(req.params.address)) return res.sendStatus(400);
  const txs = await bc.getTxsWithInternals(req.params.address);
  res.send(txs);
}));

module.exports = router;
