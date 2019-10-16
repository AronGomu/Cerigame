const express = require("express");
const path = require("path");
const members = require("./Members");
const logger = require("./middleware/logger");

// test test test

/*
const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  password: "postgres",
  host: uapv1700716,
  port: 3015
});
*/

const app = express();

//Init MiddleWare
//app.use(logger);

// Get

app.get("/logged", function (req, res) {
  console.log("username: " + req.query["username"]);
  console.log("password: " + req.query["password"]);
  res.redirect("/");
});


// Gets all members
app.get("api/members", (req, res) => res.json(members));

// Set a static folder
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3015;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));