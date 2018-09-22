/** @todo set password config variable */
const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');
const net = require('net');
const path = require('path');

require('dotenv').config(); // collect environment variables from .env file

const ipcFile = path.join(__dirname, `../blockchain/${process.env.NETWORK_NAME}/geth.ipc`);
const web3 = new Web3(ipcFile, net);

// const { BN } = web3.utils;

/**
 * complete account numbers to 10
 */
const createAccounts = async () => {
  // calcaulate how many accounts needed
  const accountsLength = 10 - (await web3.eth.getAccounts()).length;
  if (accountsLength <= 0) return;

  console.log(`creating ${accountsLength} new accounts`); // eslint-disable-line no-console

  for (let i = 0; i < accountsLength; i++) {
    await web3.eth.personal.newAccount('1123'); // eslint-disable-line no-await-in-loop
  }
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

const deployTestContract = async () => {
  console.log('deploying test contracts'); // eslint-disable-line no-console
  const input = {
    sources: {
      test: fs.readFileSync(path.join(__dirname, './contracts/Test.sol'), 'utf8'),
    },
  };
  const output = solc.compile(input);
  const abi = JSON.parse(output.contracts['test:Test'].interface);
  const bytecode = `0x${output.contracts['test:Test'].bytecode}`;

  let contract = new web3.eth.Contract(abi);
  const tx = await contract.deploy({ data: bytecode, from: web3.eth.defaultAccount });
  contract = await tx.send({
    from: web3.eth.defaultAccount,
    gas: await tx.estimateGas(),
  });

  return contract.options.address;
};

/**
 * compile test contract, get Contract instance from the ABI and address
 * @param {string} address
 * @return {Contract}
 */
const getDeployedTestContract = (address) => {
  const input = {
    sources: {
      test: fs.readFileSync(path.join(__dirname, './contracts/Test.sol'), 'utf8'),
    },
  };
  const output = solc.compile(input);
  const abi = JSON.parse(output.contracts['test:Test'].interface);
  return new web3.eth.Contract(abi, address);
};

/**
 * run defined functions in the test contract
 * @param {Contract} contract
 */
const executeTestTxs = async (contract) => {
  const accounts = await web3.eth.getAccounts();

  await contract.methods.deposit().send({
    from: web3.eth.defaultAccount,
    value: web3.utils.toWei('1.5', 'ether'),
  });
  await contract.methods.withdraw(web3.utils.toWei('1', 'ether')).send({
    from: web3.eth.defaultAccount,
  });
  await contract.methods.testTransfer(accounts[1]).send({
    from: web3.eth.defaultAccount,
    value: web3.utils.toWei('0.5', 'ether'),
  });
};

/**
 * create 20 accounts and send eth to all of them
 */
const run = async () => {
  [web3.eth.defaultAccount] = await web3.eth.getAccounts();
  await web3.eth.personal.unlockAccount(web3.eth.defaultAccount, '1123', 0);

  try {
    // if accounts are not already created
    if ((await web3.eth.getAccounts()).length <= 10) {
      await createAccounts();
      await unlockAccounts();
      await distributeMoney();
      await showBalances();
      const address = await deployTestContract();
      const contract = getDeployedTestContract(address);
      await executeTestTxs(contract);
    }
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
  process.exit();
};

run();
