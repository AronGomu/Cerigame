const {
  Client
} = require("pg"); // used to use pgsql with js

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

const dbNameUsers = "fredouil.users";
const dbNameHistorique = "fredouil.historique";

module.exports.createClient = createClient;
module.exports.dbNameUsers = dbNameUsers;
module.exports.dbNameHistorique = dbNameHistorique;