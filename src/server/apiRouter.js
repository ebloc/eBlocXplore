const express = require('express');

const router = express.Router();
const { web3 } = global;

router.get('/recentBlocks', async (req, res) => {
  const promises = [];
  const count = 50;
  const lastBlockNum = await web3.eth.getBlockNumber();

  for (let i = 0; i <= count; i++) {
    promises.push(web3.eth.getBlock(lastBlockNum - i));
  }

  const blocks = await Promise.all(promises);
  blocks.sort((a, b) => b.number - a.number);

  const result = blocks.map(block => ({
    number: block.number,
    miner: block.miner,
    timestamp: block.timestamp,
    txCount: block.transactions.length,
  }));
  res.send(result);
});

module.exports = router;
