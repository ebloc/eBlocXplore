// @todo set password config variable
const Web3 = require('web3');
const net = require('net');
const path = require('path');

require('dotenv').config(); // collect environment variables from .env file

const ipcFile = path.join(__dirname, `../blockchain/${process.env.NETWORK_NAME}/geth.ipc`);
const web3 = new Web3(ipcFile, net);

// const { BN } = web3.utils;

/**
 * complete account numbers to 20
 */
const createAccounts = async () => {
  // calcaulate how many accounts needed
  const accountsLength = 20 - (await web3.eth.getAccounts()).length;
  if (accountsLength < 0) return;
  // create them
  const promises = Array(accountsLength).fill(async () => {
    await web3.eth.personal.newAccount('1123');
  });
  await Promise.all(promises);
};

/**
 * @todo delete this
 * unlock all accounts (each has same password)
 */
const unlockAccounts = async () => {
  console.log('unlocking accounts...'); // eslint-disable-line no-console
  const accounts = await web3.eth.getAccounts();
  const unlockPromises = accounts.map(account =>
    web3.eth.personal.unlockAccount(account, '1123', 0));

  await Promise.all(unlockPromises);
};

/**
 * send each account 100 ETH from the first account (coinbase)
 */
const distributeMoney = async () => {
  const ethValue = '100';
  console.log(`distributing ${ethValue} ETH per account...`); // eslint-disable-line no-console
  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];
  const receivers = accounts.slice(1, accounts.length);

  await web3.eth.personal.unlockAccount(sender, '1123', 0);
  const txPromises = receivers.map(account => web3.eth.sendTransaction({
    from: sender,
    to: account,
    value: web3.utils.toWei(ethValue, 'ether'),
  }));

  await Promise.all(txPromises);
};

/**
 * show balances of all externally owned accounts
 */
const showBalances = async () => {
  const accounts = await web3.eth.getAccounts();
  const balancePromises = accounts.map(account => web3.eth.getBalance(account));
  const balances = await Promise.all(balancePromises);

  accounts.forEach((account, i) => {
    console.log(`${account}: ${web3.utils.fromWei(balances[i])} ETH`); // eslint-disable-line no-console
  });
};

/**
 * create 20 accounts and send eth to all of them
 */
const run = async () => {
  try {
    // if accounts are not already created
    if ((await web3.eth.getAccounts()).length <= 1) {
      await createAccounts();
      await unlockAccounts();
      await distributeMoney();
    }
    await showBalances();
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
  process.exit();
};

run();
