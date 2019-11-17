const {
	Client
} = require("pg"); // used to use pgsql with js

function createClient() {
	const client = new Client({
		user: "postgres",
		password: "Cheerio!",
		host: "localhost",
		port: 5432, // It's 3015 on uni database
		database: "basic"
	});

	return client;
}

const dbName = "basic1";

module.exports.createClient = createClient;
module.exports.dbName = dbName;