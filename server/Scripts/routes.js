const God = require('./God.js')
const fs = require('fs');
const GM = require('./GM.js')


module.exports = (app) => {

  app.get('/', (req, res) => {
    res.send("You've discovered my secret website!");
  })

  app.get('/TestWord', (req, res) => {
    res.json(GM.ConnectMessage());
  })

}

