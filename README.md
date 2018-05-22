#hinode
Asset management, network monitoring system

###Installation

This project is using react, node and mongodb,  

Once you clone the project you should touch a .env file inside the server folder
and set MONGODB_CONN_STRING as environment variable, for exmple:

MONGODB_CONN_STRING=mongodb://exmplesupersecretmongodbconnectionstringetceteraetcetera

I will include mongo db schemas soon.

cd inside the client folder and run npm install

cd inside the server folder and run npm Installation

###Run client from project root directory
cd client
npm start

###Run server from porject root directory
cd server
node index.js

I recommend to install supervisor globally with: npm install -g supervisor
and run the node server with:
supervisor index.js
