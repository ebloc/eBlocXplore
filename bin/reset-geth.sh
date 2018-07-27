#!/usr/bin/env bash
# remove chain data and logs for given network
ROOTDIR=$(dirname "$0")/.. # root directory of the application
source ${ROOTDIR}/.env # get environment variables

DATADIR=${ROOTDIR}/blockchain/${NETWORK_NAME}/ # blockchain path
LOGPATH=${ROOTDIR}/logs/geth-${NETWORK_NAME}.log # log file path

# do not let invalid networks
if [[ $NETWORK_NAME != 'ebloc-poa' && $NETWORK_NAME != 'main' && $NETWORK_NAME != 'local' ]]; then
  echo 'Invalid network name'
  exit 1
fi

echo 'Removing chain data'
rm -r ${DATADIR}
echo 'Removing log files'
rm ${LOGPATH}