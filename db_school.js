const { Client } = require("pg"); // used to use pgsql with js

function createClient() {
  const client = new Client({
    user: "uapv1700716",
    password: "iNomdp",
    host: "localhost",
    port: 5432,
    database: "etd"
  });

  return client;
}

const dbName = "fredouil.users";

module.exports.createClient = createClient;
module.exports.dbName = dbName;
