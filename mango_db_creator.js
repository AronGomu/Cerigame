// => https://www.w3schools.com/nodejs/nodejs_mongodb.asp

const data = require('./questions')
const mongo = require('mongodb');
const url = "mongodb://localhost:27017/cerigame_db";

// Creating all clients

client_easy_collection_creator = mongo.MongoClient;
client_easy_collection_populator = mongo.MongoClient;
client_medium_collection_creator = mongo.MongoClient;
client_medium_collection_populator = mongo.MongoClient;
client_hard_collection_creator = mongo.MongoClient;
client_hard_collection_populator = mongo.MongoClient;


// Easy Questions Part

client_easy_collection_creator.connect(url, function (err, db) {
	if (err) throw err;
	var dbo = db.db("cerigame_db");
	console.log("Trying to create easy_questions collection")
	dbo.createCollection("easy_questions", function (err, res) {
		if (err) throw err;
		console.log("Collection created!");
		db.close();
	});

});

client_easy_collection_populator.connect(url, function (err, db) {
	if (err) throw err;
	var dbo = db.db("cerigame_db");
	console.log("Trying to populate easy_questions collection");
	console.log('What is inserted : ' + data.all_easy_questions[1].id);
	dbo.collection("easy_questions").insertMany(data.all_easy_questions, function (err, res) {
		if (err) throw err;
		console.log("Number of documents inserted: " + res.insertedCount);
		db.close();
	});
});

/*
// Medium Questions Part

client_medium_collection_creator.connect(url, function (err, db) {
	if (err) throw err;
	var dbo = db.db("cerigame_db");
	dbo.createCollection("medium_questions", function (err, res) {
		if (err) throw err;
		console.log("Collection created!");
	});
	db.close();
});


client_medium_collection_populator.connect(url, function (err, db) {
	if (err) throw err;
	var dbo = db.db("cerigame_db");
	console.log("Trying to populate easy_questions collection")
	dbo.collection("questions").insertMany(data.all_medium_questions, function (err, res) {
		if (err) throw err;
		console.log("Number of documents inserted: " + res.insertedCount);
		db.close();
	});
});


// Hard Questions Part

client_hard_collection_creator.connect(url, function (err, db) {
	if (err) throw err;
	var dbo = db.db("cerigame_db");
	dbo.createCollection("hard_questions", function (err, res) {
		if (err) throw err;
		console.log("Collection created!");
	});
	db.close();
});


client_hard_collection_populator.connect(url, function (err, db) {
	if (err) throw err;
	var dbo = db.db("cerigame_db");
	console.log("Trying to populate easy_questions collection")
	dbo.collection("questions").insertMany(data.all_hard_questions, function (err, res) {
		if (err) throw err;
		console.log("Number of documents inserted: " + res.insertedCount);
		db.close();
	});
});
*/