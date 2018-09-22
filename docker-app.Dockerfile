FROM node:9.5.0

ENV NODE_ENV=production
ENV PORT=8000
ENV NETWORK_NAME=ebloc-poa

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app

# Go to app directory
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm install


COPY . /usr/src/app/
RUN npm run build

EXPOSE 8000
CMD ["npm", "start"]