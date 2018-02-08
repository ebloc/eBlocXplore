/* eslint-disable */
//Contract functions at blockchained stored.
var web3_extended = require("web3_ipc");

var options = {
  host: "http://localhost:8545",
  ipc: false,
  personal: true,
  admin: true,
  debug: true
};

var web3 = web3_extended.create(options);

if (!web3.isConnected()) console.log("not connected");
//else                    console.log("connected");

//web3.eth.defaultAccount=web3.eth.accounts[0]; //check calismaya bilir.

//  eBloc LinkedList for ethereum contracts
//address: ... //address on the private network.
address = "0xa8d81519b7ec1c8eb7982baccc4a2d9dec81df04";

abi = [
  {
    constant: true,
    inputs: [
      { name: "c_id", type: "address" },
      { name: "ipfsHash", type: "string" },
      { name: "index", type: "uint256" }
    ],
    name: "get_length",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "c_id", type: "address" },
      { name: "coreLimit", type: "uint32" }
    ],
    name: "setClusterCoreLimit",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "c_id", type: "address" }],
    name: "getClusterName",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "c_id", type: "address" }],
    name: "getClusterCoreMinutePrice",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "id", type: "address" }],
    name: "getSize",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "c_id", type: "address" }],
    name: "stopCluster",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "c_id", type: "address" },
      { name: "ipfsHash", type: "string" },
      { name: "core_", type: "uint32" },
      { name: "time", type: "string" }
    ],
    name: "insertJob",
    outputs: [{ name: "success", type: "bool" }],
    payable: true,
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "ipfsHash", type: "string" },
      { name: "index", type: "uint256" },
      { name: "str", type: "string" }
    ],
    name: "setJobStatus",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "c_id", type: "address" },
      { name: "clusterName", type: "string" }
    ],
    name: "setClusterName",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getClusterAddresses",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "c_id", type: "address" },
      { name: "price", type: "uint256" }
    ],
    name: "setClusterCoreMinutePrice",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "testCallStack",
    outputs: [{ name: "", type: "int256" }],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "s", type: "uint32" },
      { name: "e", type: "uint32" },
      { name: "c", type: "int32" },
      { name: "ipfsHash", type: "string" },
      { name: "index", type: "uint32" },
      { name: "amountToPayBack", type: "uint256" }
    ],
    name: "receiptCheck",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "ipfsHash", type: "string" },
      { name: "index", type: "uint256" },
      { name: "str", type: "string" }
    ],
    name: "setJob_IPFS_out",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "c_id", type: "address" },
      { name: "ipfsHash", type: "string" },
      { name: "index", type: "uint256" }
    ],
    name: "getJobStatus",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "c_id", type: "address" },
      { name: "ipfsHash", type: "string" },
      { name: "index", type: "uint256" }
    ],
    name: "getJob_IPFS_out",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "id", type: "address" }],
    name: "get",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "coreLimit", type: "uint32" },
      { name: "clusterName", type: "string" },
      { name: "price", type: "uint256" }
    ],
    name: "createCluster",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "index", type: "uint256" }],
    name: "get_node",
    outputs: [{ name: "", type: "string" }, { name: "", type: "address" }],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "c_id", type: "address" },
      { name: "ipfsHash", type: "string" },
      { name: "index", type: "uint32" }
    ],
    name: "getClusterJobRecieved",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "deleteAllJobs",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "c_id", type: "address" },
      { indexed: false, name: "sender", type: "address" },
      { indexed: false, name: "ipfsHash", type: "string" },
      { indexed: false, name: "amount", type: "uint256" }
    ],
    name: "LogReceivedFunds",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "c_id", type: "address" },
      { indexed: false, name: "recipient", type: "address" },
      { indexed: false, name: "amount", type: "uint256" }
    ],
    name: "LogReturnedFunds",
    type: "event"
  }
];

web3.eth.defaultAccount = web3.eth.accounts[1];

var whoami = web3.eth.defaultAccount;
var MyContract = web3.eth.contract(abi);
var myContractInstance = MyContract.at(address);
var blockNumber = web3.eth.blockNumber;

var array_size = myContractInstance.getSize("0x75a4c787c5c18c587b284a904165ff06a269b48c");
var gasLimit = 2999999;
//Global variables are used.
exports.address = address;
exports.abi = abi;
exports.array_size = array_size;
exports.whoami = whoami;
exports.blockNumber = blockNumber;

exports.deleteAllJobs = function() {
  hash = myContractInstance.deleteAllJobs({from: web3.eth.defaultAccount, gas: gasLimit});
  console.log(hash);
};

exports.get_node = function(index) {
  return myContractInstance.get_node(index);
};

//function insertBack( address c_id, string ipfsHash, uint32 coreGas, uint32 core_ )
exports.insertJob = function(val1, var2, var3, var4) {
  hash = myContractInstance.insertJob(val1, var2, var3, var4, {
    from: web3.eth.defaultAccount,
    gas: gasLimit,
    value: 10 * 1000000000000000
  });
  console.log(hash);
};

exports.isTransactionPassed = function(transaction_id) {
  var checkPassed = 0;
  var receipt = web3.eth.getTransactionReceipt(transaction_id);

  if (receipt != null) {
    //first it has to pass receipt check
    var status = web3.debug.traceTransaction(transaction_id);
    //prevents for returning error message.
    //if ( status.structLogs[status.structLogs.length-1].error == "{}" )
    if (
      status.structLogs[status.structLogs.length - 1].error == null ||
      status.structLogs[status.structLogs.length - 1].error == ""
    )
      checkPassed = 1;
  }
  //console.log( "TransactionPassed ?= " + transaction_id + ": " + checkPassed );
  console.log(checkPassed);
  return checkPassed;
};

exports.add_ipfs = function(var1, var2, var3) {
  hash = myContractInstance.add_ipfs(var1, var2, var3, {
    from: web3.eth.defaultAccount,
    gas: gasLimit
  });
  console.log(hash);
};

exports.setJobStatus = function(var1, var2, var3) {
  hash = myContractInstance.setJobStatus(var1, var2, var3, {
    from: web3.eth.defaultAccount,
    gas: gasLimit
  });
  console.log(hash);
};

exports.setJob_IPFS_out = function(var1, var2, var3) {
  hash = myContractInstance.setJob_IPFS_out(var1, var2, var3, {
    from: web3.eth.defaultAccount,
    gas: gasLimit
  });
  console.log(hash);
};

exports.getSize = function(var1) {
  return myContractInstance.getSize(var1);
};

exports.get_status = function(var1, var2) {
  return myContractInstance.get_status(var1, var2);
};

exports.getJob_IPFS_out = function(var1, var2, var3) {
  return myContractInstance.getJob_IPFS_out(var1, var2, var3);
};

exports.createCluster = function(var1, var2, var3) {
  hash = myContractInstance.createCluster(var1, var2, var3, {
    from: web3.eth.defaultAccount,
    gas: gasLimit
  });
  console.log(hash);
};

exports.getClusterAddresses = function() {
  return myContractInstance.getClusterAddresses();
};

exports.setClusterCoreMinutePrice = function(var1, var2) {
  hash = myContractInstance.setClusterCoreMinutePrice(var1, var2, {
    from: web3.eth.defaultAccount,
    gas: gasLimit
  });
  console.log(hash);
};

exports.getClusterCoreMinutePrice = function(var1) {
  return myContractInstance.getClusterCoreMinutePrice(var1);
};

exports.highestBlock = function() {
  var sync = web3.eth.syncing;
  console.log(sync.highestBlock);
  return sync.highestBlock;
};

exports.receiptCheck = function(var1, var2, var3, var4, var5, var6) {
  hash = myContractInstance.receiptCheck(var1, var2, var3, var4, var5, var6);
  console.log(hash);
};

//var Web3 = require('/home/netlab/BLOCXPLORE/node_modules/web3/index.js');
//var Web3 = require('/home/netlab/.npm/web3/0.16.0/package/index.js');
//var web3 = new Web3();
//web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
