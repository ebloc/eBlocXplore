/* eslint-disable */
var mylib = require("/home/netlab/BLOCXPLORE/header.js");
clusterOwner = "0x6af0204187a93710317542d383a1b547fa42e705";
//Create Cluster:
//mylib.createCluster(128, "ebloc", 1000000000000000);
console.log(mylib.getClusterAddresses());

//Client-Side submit:
mylib.insertJob(clusterOwner, "QmWmyoMoctfbAaiEs2G46gpeUmhqFRDW6KWo64y5r581Vd", 4, "0-00:10");

//console.log( mylib.whoami );

//mylib.setClusterCoreMinutePrice( clusterOwner, 10 );

console.log("Array Size: " + mylib.getSize(clusterOwner));

//a = mylib.getClusterCoreMinutePrice( clusterOwner );
//console.log( "aa"  + a );

for (var i = 0; i < mylib.getSize(clusterOwner); i++) {
  console.log(mylib.get_node(i));
}

//console.log( "Array Size: " + mylib.getSize( "0x6af0204187a93710317542d383a1b547fa42e705" ));
//for(var i=0; i < 3; i++){
//    console.log( mylib.get_node(i) );
//}

t = "0x4766ddb0c19739057c2c24ee3ec7e2c06bf01662f581721370fdadc629f033a5";
val = mylib.isTransactionPassed(t);
console.log("TransactionPassed ?= " + t + ": " + val);

console.log("Returned Job: " + mylib.getJob_IPFS_out(clusterOwner, "QmWmyoMoctfbAaiEs2G46gpeUmhqFRDW6KWo64y5r581Vd", 0));

//mylib.insertBack( "0x6af0204187a93710317542d383a1b547fa42e705", "999", 100, 4 )

//var Web3  = require('/home/netlab/BLOCXPLORE/node_modules/web3/index.js');
//var web3  = new Web3();
//web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

//if(!web3.isConnected()) console.log("not connected");
//else                    console.log("connected");

// Creation of contract object
//var MyContract = web3.eth.contract(mylib.abi);
//var myContractInstance = MyContract.at(mylib.address);

// hash = myContractInstance.delete_node(0, {from: web3.eth.accounts[0]} );
// console.log( hash );

//QmaUf2DxtidNHp4K7LFxAGMJcyDVk4THPB6crhdh5LFvU7

//mylib.deleteAll();
//mylib.insertfront("QmQVQqfXhFGi3Cra8aX1s5bAFiHxUAJDrUe6inTJGaFZbn")

//console.log( mylib.get_status("QmQVQqfXhFGi3Cra8aX1s5bAFiHxUAJDrUe6inTJGaFZbn",      0) );
//console.log( mylib.get_ipfs_output("QmQVQqfXhFGi3Cra8aX1s5bAFiHxUAJDrUe6inTJGaFZbn", 0) );

//I have used highest gas. non-used gas will be refunded.

//Main... deneme amacli.
//endBlockNumber   = web3.eth.blockNumber;
//console.log(endBlockNumber);
//var peerCount = web3.net.peerCount;
//console.log(peerCount); // 4
