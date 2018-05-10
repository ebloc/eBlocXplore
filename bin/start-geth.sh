#!/usr/bin/env bash
# start an ethereum with given network
killall geth

NETWORK=$1

# do not let invalid networks
if [[ $NETWORK != 'ebloc-poa' && $NETWORK != 'main' ]]; then
  echo 'Invalid network name'
  exit 1
fi

ROOTDIR=$(dirname "$0")/..
DATADIR=${ROOTDIR}/blockchain/${NETWORK}/
GENESIS=${ROOTDIR}/bin/network-config/${NETWORK}.json
PORT=30303
RPCADDR=127.0.01
RPCPORT=8545

# init blockchain if private network
if [[ ! -d ${DATADIR} && ${NETWORK} == 'ebloc-poa' ]]; then
  geth --datadir ${DATADIR} init ${GENESIS}
fi

# @TODO create log folder
nohup geth --datadir ${DATADIR} --port ${PORT} &> ${ROOTDIR}/logs/geth-${NETWORK}.out& # NO RPC # --rpc --rpcaddr ${RPCADDR} --rpcport ${RPCPORT} --rpccorsdomain="*" --rpcapi eth,net,web3,personal,admin &

# add peers to private networks
if [[ ${NETWORK} == 'ebloc-poa' ]]; then
  sleep 5s
  echo '{"jsonrpc":"2.0","method":"admin_addPeer","params":["enode://fb6215e1f7ae62b3e1901c6a6e382d1e6c9a6cf8fb1eabc8979dbe4b1dca1f2eb38fad914dd69f22981f256ec7197f156f887673f2b3764a12be2b561e9ede54@79.123.177.145:3016"],"id":1}' | nc -U ${DATADIR}/geth.ipc
  echo '{"jsonrpc":"2.0","method":"admin_addPeer","params":["enode://c18763f3cd15a0f40ead769045332db8a42e1eb365a291dc3e0b03a71a3ff94f6c2bfea17e5cb14dfaa0d7ae887a1505f3d5809f96f47e5a7377904b4032cbea@193.140.197.95:3001"],"id":1}' | nc -U ${DATADIR}/geth.ipc
  echo '{"jsonrpc":"2.0","method":"admin_addPeer","params":["enode://ae57fcb24c19102ebe18e16b7c43afd44444d920291995cb032e485982b9b188bda3d26ed02e0e28888c88cf76326f6585ca0bd232ea451ac008f346d90c996c@193.140.196.159:300"],"id":1}' | nc -U ${DATADIR}/geth.ipc
fi

# connect to the started client
# geth attach ipc:blockchain/${DATADIR}/geth.ipc