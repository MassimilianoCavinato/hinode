# hinode
Asset management, network monitoring system

## Installation

This project is using react, node and mongodb,  

Once you clone the project you should touch a .env file inside the server folder
and set MONGODB_CONN_STRING as environment variable, for exmple:

MONGODB_CONN_STRING=mongodb://exmplesupersecretmongodbconnectionstringetceteraetcetera

I will include mongo db schemas soon.

### Installation
```
cd client
npm install

cd server
npm install
```

### Run client from project root directory
```
cd client
npm start
```

### Run server from project root directory
```
cd server
node index.js
````

#### I recommend to install supervisor globally with:

```
npm install -g supervisor
cd server
supervisor index.js
```

## This repo is under active development, it could be broken, clone it at your own risk :D
