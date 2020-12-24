var exports = module.exports = {};

tmi = require('tmi.js');

// Connection info and params for TMI.JS
options = {
    options:{
      debug: true
    },
    connection: {
      cluster: "aws",
      reconnect: true
    },
    identity: {
      username: "",
      password: ""
    },
    channels: []
};

// Generate Twitch Client and Connects it to the specified Channels.
client = new tmi.client(options);
client.connect();
// King Of Nordic Chat bot with !honorbet
client.on('connected', function(adress, port) { console.log("Adress: " + adress + " Port: " + port); });