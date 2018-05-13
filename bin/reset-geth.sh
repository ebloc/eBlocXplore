#!/usr/bin/env bash
# remove chain data and logs for given network
NETWORK=$1

ROOTDIR=$(dirname "$0")/.. # root directory of the application
DATADIR=${ROOTDIR}/blockchain/${NETWORK}/ # blockchain path
LOGPATH=${ROOTDIR}/logs/geth-${NETWORK}.out # log file path

# do not let invalid networks
if [[ $NETWORK != 'ebloc-poa' && $NETWORK != 'main' && $NETWORK != 'local' ]]; then
  echo 'Invalid network name'
  exit 1
fi

echo 'Removing chain data'
rm -r ${DATADIR}
echo 'Removing log files'
rm ${LOGPATH}