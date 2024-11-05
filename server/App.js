const express = require('express')
const app = express()
const http = require('http');
const https = require('https');
const bodyParser= require('body-parser');
const fs = require('fs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const God = require('./Scripts/God.js');
const WS = require('./WebSockets.js');
const port=5010;


const cors = require("cors");
app.use(cors({ 
  origin: God.IsLocal ? "http://localhost:1234" : "https://website.url",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true // allow session cookie from browser to pass through
}));

require('./Scripts/routes')(app);

var server = God.IsLocal ? http.createServer(app) : https.createServer(options, app);

process.on('uncaughtException', function(err) {
  let lstr ="";
  lstr += "\n"+err.stack + "\n\n";//JSON.stringify(log,null,2);
  console.log(lstr);
  if (!lstr || lstr == "") {
    console.log("EROR LOG ERROR: " + lstr)
    return;
  }
  fs.appendFile(God.ErrPath, lstr, (err) => {
    if (err) {console.log("ERROR LOG ERR: " + err.message);throw err;}
  });
});

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

WS.Setup(server); 