const polka = require('polka');
const endpoints = require("./endpoints.js");

process.on("unhandledRejection",console.error)

endpoints(polka()).listen(8080),"Listening on Port 8080";