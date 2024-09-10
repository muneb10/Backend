const http = require("http"); //inport http module
const port = process.env.PORT || 3000; //set PORT
const app = require("./app");

const sever = http.createServer(app); //set up the server

sever.listen(port);
