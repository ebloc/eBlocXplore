#/bin/sh

# start an ethereum with given network
ROOTDIR=$(dirname "$0")/.. # root directory of the application

NETWORK_NAME='ebloc-poa'
echo NETWORK: $NETWORK_NAME
# source ${ROOTDIR}/.env # get environment variables

DATADIR=${ROOTDIR}/blockchain/${NETWORK_NAME} # blockchain path
GENESISPATH=${ROOTDIR}/bin/network-config/${NETWORK_NAME}.json # genesis config json path
STATICNODES=${ROOTDIR}/bin/network-config/${NETWORK_NAME}-static-nodes.json # static nodes
LOGPATH=${ROOTDIR}/logs/geth-${NETWORK_NAME}.log # log file path
PORT=30303
RPCADDR=0.0.0.0
RPCPORT=8545
NETWORKID=1
MINE=false # only mine if local
# set network ids
if [[ ${NETWORK_NAME} == 'ebloc-poa' ]]; then
  NETWORKID=23422
elif [[ ${NETWORK_NAME} == 'local' ]]; then
  NETWORKID=5192851 # any random number
  MINE=true
fi

# do not let invalid networks
if [ $NETWORK_NAME != 'ebloc-poa' ] && [ $NETWORK_NAME != 'main' ] && [ $NETWORK_NAME != 'local' ]
then
  echo 'Invalid network name'
  exit 1
fi

# init blockchain if private network
if [ ! -d ${DATADIR}/geth/chaindata ] && { [ ${NETWORK_NAME} == 'ebloc-poa' ] || [ ${NETWORK_NAME} == 'local' ]; }
then
  echo 'STARTING NEW CHAIN'
  geth --datadir ${DATADIR} init ${GENESISPATH} # &> ${LOGPATH}
  # ex: geth --datadir blockchain/local init bin/network-config/local.json
  # @TODO copy keystore
  echo '[
    "enode://fb6215e1f7ae62b3e1901c6a6e382d1e6c9a6cf8fb1eabc8979dbe4b1dca1f2eb38fad914dd69f22981f256ec7197f156f887673f2b3764a12be2b561e9ede54@79.123.177.145:3016",
    "enode://c18763f3cd15a0f40ead769045332db8a42e1eb365a291dc3e0b03a71a3ff94f6c2bfea17e5cb14dfaa0d7ae887a1505f3d5809f96f47e5a7377904b4032cbea@193.140.197.95:3001",
    "enode://ae57fcb24c19102ebe18e16b7c43afd44444d920291995cb032e485982b9b188bda3d26ed02e0e28888c88cf76326f6585ca0bd232ea451ac008f346d90c996c@193.140.196.159:300"
  ]' > ${DATADIR}/geth/static-nodes.json

  echo '{
    "address": "2e72489335d90514e5e0f6b12a15661556b2c414",
    "crypto": {
      "cipher": "aes-128-ctr",
      "ciphertext": "16e9c982ca0552ba8c77ab6e9b61b6ed8078b8d5f776004d6fd34f27e05c53c8",
      "cipherparams": {"iv": "abf47e88a49c1f3600f2f8602e9bf68c"},
      "kdf": "scrypt",
      "kdfparams": {"dklen": 32,"n": 262144,"p": 1,"r": 8,"salt": "b1f92427ae43051d3ea22b9fa5cb267ed73bd90cdd3217232d19a27c94473148"},
      "mac": "05fedfeb5725d577b9ce6c5c94b7fee37502be966cd12d69dc502a7c1a5a2e13"
    },
    "id": "d6c7c3f7-7639-405e-b795-c88803cd0b08",
    "version": 3
  }' > ${DATADIR}/keystore/UTC--2018-05-11T14-04-01.107143474Z--2e72489335d90514e5e0f6b12a15661556b2c414
fi

echo 'STARTING GETH'
geth --datadir ${DATADIR} --port ${PORT} --networkid ${NETWORKID} --syncmode=full --gcmode=archive --cache 1024 --mine=${MINE} --etherbase=0x2e72489335d90514e5e0f6b12a15661556b2c414 --rpc --rpcaddr ${RPCADDR} --rpcport ${RPCPORT} --rpccorsdomain="*" --rpcapi eth,net,web3,personal --rpcvhosts="*"
# connect to the started client
# geth attach ipc:blockchain/${DATADIR}/geth.ipc
# geth --datadir ./../blockchain/ebloc-poa --port 30303 --networkid 23422 --syncmode=full --gcmode=archive --cache 1024 --mine=false --etherbase=0x2e72489335d90514e5e0f6b12a15661556b2c414 --rpc --rpcaddr 127.0.0.1 --rpcport 8545
echo 'byebye ;)'