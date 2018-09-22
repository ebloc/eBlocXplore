FROM ethereum/client-go

# Go to app directory
WORKDIR /usr/src/app
ADD . .

ENTRYPOINT [ "sh", "-c", "./bin/start-geth.sh" ]
