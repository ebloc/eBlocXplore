/* eslint-disable */
//TODO: delete all commentes.
var path = require("path");
var global_myaccount;

function getBlockWhile(blockno, end, count, data, res) {
  web3.eth.getBlock(blockno).then(function(block) {
    var d = new Date(block.timestamp * 1000);
    var n = d.toUTCString();
    data[count] = ["@@" + blockno + "@@", "@@" + block.miner + "@@", n, block.transactions.length];

    if (blockno < end) {
      count = count + 1;
      getBlockWhile(blockno + 1, end, count, data, res);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(data));
    }
  }).catch(function (err) {
    console.error(err);
  });
}

function retBtabl(data, res) {
  web3.eth.getBlockNumber().then(function (latbno) {
    var block;
    var blockno;
    var n;
    var d;
    var txcount;

    count = 0;
    i = 0;
    getBlockWhile(latbno - 100, latbno, count, data, res);
  })
}

function strarep(str1, str2) {
  var str = '<a onClick="a_onClick(' + "'" + str1 + "'" + ')">' + str2 + "</a>";
  return str;
}

function isAddress(address) {
  if (/^(0x)?[0-9a-f]{40}$/.test(address) ||/^(0x)?[0-9A-F]{40}$/.test(address)) {
    return true;
  }
  return false;
}

function isHash(hash) {
  if (/^(0x)?[0-9a-f]{64}$/.test(hash) || /^(0x)?[0-9A-F]{64}$/.test(hash)) {
    return true;
  }
  return false;
}

function isBlockno(blockno) {
  if (/^\d{1,7}$/.test(blockno)) {
    return true;
  }
  return false;
}

function retAddress(addrhash) {
  var balance = web3.utils.fromWei(web3.eth.getBalance(addrhash));
  dat = [["Balance", balance]];
  return dat;
}

function retTransaction(txHash) {
  var tx = web3.eth.getTransaction(txHash);
  dat = null;
  if (tx != null) {
    dat = [
      ["From", "@@" + tx.from + "@@"],
      ["To", "@@" + tx.to + "@@"],
      ["Value", tx.value],
      ["Nonce", tx.nonce],
      ["Gas", tx.gas],
      ["Gas Price", tx.gasPrice],
      ["Input", tx.input],
      ["Block Hash", "@@" + tx.blockHash + "@@"],
      ["Block Number", "@@" + tx.blockNumber + "@@"],
      ["Transaction Index", tx.transactionIndex]
    ];
  }
  return dat;
}

function retBlock(block) {
  var block = web3.eth.getBlock(block);
  if (block == null) {
    return null;
  }
  var d = new Date(block.timestamp * 1000);
  var n = d.toUTCString();

  dat = [
    ["Block Number", "@@" + block.number + "@@"],
    ["Hash", "@@" + block.hash + "@@"],
    ["Parent Hash", "@@" + block.parentHash + "@@"],
    ["Nonce", block.nonce],
    ["Sha3 Uncles", block.sha3Uncles],
    ["Transactions Root", block.transactionsRoot],
    ["State Root", block.stateRoot],
    ["Miner", "@@" + block.miner + "@@"],
    ["Difficulty", block.difficulty],
    ["Total Difficulty", block.totalDifficulty],
    ["Extra Data", block.extraData],
    ["Size", block.size],
    ["Gas Limit", block.gasLimit],
    ["Gas Used", block.gasUsed],
    ["Time Stamp", n]
  ];
  return dat;
}

function getBlockTx(number, endBlockNumber, myaccount, j, abtx, res) {
  web3.eth.getBlock(number, function(error, block) {
    var myFlag = 0;
    if (block != null && block.transactions != null) {
      for (var k = 0; k < block.transactions.length; k++) {
        // block.transactions.forEach( function(e) {
        e = block.transactions[k];
        //console.log(global_myaccount)
        if (global_myaccount == web3.eth.getTransaction(block.transactions[k]).to && global_myaccount == web3.eth.getTransaction(block.transactions[k]).from) {
          var d = new Date(block.timestamp * 1000);
          var t = d.toGMTString();
          abtx[j] = [
            "Tx: " +
              "@@" +
              web3.eth.getTransaction(block.transactions[k]).hash +
              "@@",
            '<span class="glyphicon glyphicon-resize-horizontal" style="color:AntiqueWhite2"></span> ' +
              "@@" +
              web3.eth.getTransaction(block.transactions[k]).to +
              "@@" +
              " <br>Value: " +
              web3.utils.fromWei(web3.eth.getTransaction(block.transactions[k]).value, "ether") +
              "<br>Gas: " +
              web3.utils.fromWei(web3.eth.getTransaction(block.transactions[k]).gas, "ether") +
              "<br>Time: " +
              t
          ];
          j++;
        } else if (global_myaccount == web3.eth.getTransaction(block.transactions[k]).from) {
          var d = new Date(block.timestamp * 1000);
          var t = d.toGMTString();
          abtx[j] = [
            "Tx: " +
              "@@" +
              web3.eth.getTransaction(block.transactions[k]).hash +
              "@@",
            '<span class="glyphicon glyphicon-arrow-right" style="color:orange"></span> ' +
              "@@" +
              web3.eth.getTransaction(block.transactions[k]).to +
              "@@" +
              " </br>Value: " +
              web3.utils.fromWei(
                web3.eth.getTransaction(block.transactions[k]).value,
                "ether"
              ) +
              "<br>Gas: " +
              web3.utils.fromWei(
                web3.eth.getTransaction(block.transactions[k]).gas,
                "ether"
              ) +
              "<br>Time: " +
              t
          ];
          j++;
        } else if (global_myaccount == web3.eth.getTransaction(block.transactions[k]).to) {
          var d = new Date(block.timestamp * 1000);
          var t = d.toGMTString();
          abtx[j] = [
            "Tx: " +
              "@@" +
              web3.eth.getTransaction(block.transactions[k]).hash +
              "@@",
            '<span class="glyphicon glyphicon-arrow-left" style="color:green"></span> ' +
              "@@" +
              web3.eth.getTransaction(block.transactions[k]).from +
              "@@" +
              " <br>Value: " +
              web3.utils.fromWei(
                web3.eth.getTransaction(block.transactions[k]).value,
                "ether"
              ) +
              "<br>Gas: " +
              web3.utils.fromWei(
                web3.eth.getTransaction(block.transactions[k]).gas,
                "ether"
              ) +
              "<br>Time: " +
              t
          ];
          j++;
        }
        if (j == 21) {
          if (myFlag == 0) {
            try {
              res.setHeader("Content-Type", "application/json");
              res.send(JSON.stringify(abtx, null, 3));
              myFlag = 1;
            } catch (err) {
              //console.log(err)
            }
          }
          return;
        }
      }
    }
    if (j == 21) {
      if (myFlag == 0) {
        try {
          res.setHeader("Content-Type", "application/json");
          res.send(JSON.stringify(abtx, null, 3));
          myFlag = 1;
        } catch (err) {
          //console.log(err)
        }
      }
      return;
    }

    if (number <= endBlockNumber) {
      getBlockTx(number + 1, endBlockNumber, myaccount, j, abtx, res);
    } else {
      if (myFlag == 0) {
        try {
          res.setHeader("Content-Type", "application/json");
          res.send(JSON.stringify(abtx, null, 3));
          myFlag = 1;
        } catch (err) {
          //console.log(err)
        }
      }
      return;
    }
  });
}

function getTransactionsByAccount(myaccount, howmany, res, abtx) {
  endBlockNumber = web3.eth.blockNumber;
  startBlockNumber = endBlockNumber - 1000;

  j = 0; //abtx.length;
  global_myaccount = myaccount;
  getBlockTx(startBlockNumber, endBlockNumber, myaccount, j, abtx, res);
}

function getBlock(number, endBlockNumber, res, j, abtx) {
  web3.eth.getBlock(number).then(function(block) {
    var myFlag = 0;
    if (block != null && block.transactions != null) {
      for (var k = 0; k < block.transactions.length; k++) {
        e = block.transactions[k];
        var d = new Date(block.timestamp * 1000);
        var t = d.toGMTString();
        var ehash = e.substring(0, 12) + "..." + e.slice(-12);
        //console.log( web3.eth.getTransaction(block.transactions[k]).from    ) ;
        web3.eth.getTransaction(block.transactions[k]).then(function (tx) {
          abtx[j] = [
            '<span class="glyphicon glyphicon-arrow-left" style="color:orange"></span> ' +
              strarep(
                tx.from,
                tx.from
              ) +
              '<br><span class="glyphicon glyphicon-arrow-right" style="color:green"></span> ' +
              strarep(
                tx.to,
                tx.to
              ),
            web3.utils.fromWei(
              tx.value,
              "ether"
            ),
            '<span class="label label-info"> Tx </span>&nbsp;' +
              strarep(block.transactions[k], ehash) +
              " <br>" +
              t
          ];
          j++;
          if (j == 21) {
            if (myFlag == 0) {
              try {
                res.setHeader("Content-Type", "application/json");
                res.send(JSON.stringify(abtx));
                myFlag = 1;
              } catch (err) {
                //console.log(err)
              }
            }
            return;
          }
        }).catch(console.error);

      }
    }
    if (j == 21) {
      if (myFlag == 0) {
        try {
          res.setHeader("Content-Type", "application/json");
          res.send(JSON.stringify(abtx));
          myFlag = 1;
        } catch (err) {
          //console.log(err)
        }
      }
      return;
    }
    if (number <= endBlockNumber) {
      getBlock(number + 1, endBlockNumber, res, j, abtx);
    } else {
      if (myFlag == 0) {
        try {
          res.setHeader("Content-Type", "application/json");
          res.send(JSON.stringify(abtx));
          myFlag = 1;
        } catch (err) {
          //console.log(err)
        }
      }
      return;
    }
  }).catch(function (err) {
    console.error(err);
    res.sendStatus(500);
  });
}

function getLatestTransactions(howmany, res, abtx) {
  web3.eth.getBlockNumber().then(function (endBlockNumber) {
    startBlockNumber = endBlockNumber - 20;

    j = 0;
    getBlock(startBlockNumber, endBlockNumber, res, j, abtx);
  }).catch(function (err) {
    console.error(err);
  })
}

// ----------------------------------------------------------------------------------
var Web3 = require("web3");
var web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

if (!web3.eth.net.isListening()) {
  console.log("not connected");
} else {
  console.log("connected");
}

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var reload = require("reload");

reload(app);

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// app.use(bodyParser.json()) // @todo probable forgotten
// console.log(`__dirname: `, __dirname);
app.use(express.static(path.join(__dirname, "../client")));

app.get("/btabl", function(req, res) {
  dat = [];
  retBtabl(dat, res);

  //res.setHeader('Content-Type', 'application/json');
  //res.send(JSON.stringify( dat ));
  //res.send(JSON.stringify(retBtabl(dat)));
});

app.get("/txtabl", function(req, res) {
  //global_res = res;
  abtx = [];
  getLatestTransactions(6, res, abtx);

  //res.setHeader('Content-Type', 'application/json');
  //res.send(JSON.stringify(abtx));
});

app.get("/stxtabl", function(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(retBlock(8)));
});

app.get("/stxtabl2", function(req, res) {
  //global_res = res;
  abtx = [];
  getLatestTransactions(2, res, abtx);

  //res.setHeader('Content-Type', 'application/json');
  //res.send(JSON.stringify(abtx));
});

app.get("/sbltabl", function(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(sbltabl));
});

app.get("/what/*", function(req, res) {
  var btx;
  var htype;

  if (isAddress(req.params["0"])) {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify("Address", null, 3));
  } else if (isBlockno(req.params["0"])) {
    htype = "Block";
    btx = web3.eth.getBlock(req.params["0"]);
    if (btx == null) {
      htype = "None";
    }
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(htype, null, 3));
  } else if (isHash(req.params["0"])) {
    btx = web3.eth.getBlock(req.params["0"]);
    htype = "Block";
    if (btx == null) {
      btx = web3.eth.getTransaction(req.params["0"]);
      htype = "Transaction";
      if (btx == null) {
        htype = "None";
      }
    }
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(htype, null, 3));
  }
});

app.get("/search/*", function(req, res) {
  var btx;

  btx = [];
  abtx = [];
  if (isAddress(req.params["0"])) {
    //global_res = res;
    abtx = retAddress(req.params["0"]);
    //console.log(abtx);
    getTransactionsByAccount(req.params["0"], 200, res, abtx);
    //res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.stringify(abtx, null, 3));
  } else if (isBlockno(req.params["0"])) {
    btx = retBlock(req.params["0"]);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(btx, null, 3));
  } else if (isHash(req.params["0"])) {
    btx = retBlock(req.params["0"]);
    if (btx == null) {
      btx = retTransaction(req.params["0"]);
      if (btx == null) {
        btx = "None";
      }
    }
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(btx, null, 3));
  }
});

var server = app.listen(8000, function() {
  var host = "localhost";
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
