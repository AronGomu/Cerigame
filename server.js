console.log("Server Starting...");

const express = require("express");
const db = require("./db_school.js");
const mongo = require("mongodb");
const bodyParser = require("body-parser");
const path = require("path"); //used for static directory path
const sha1 = require("sha1");
const moment = require('moment');

const PORT = 3015;

const app = express();

const mongoUrl = "mongodb://localhost:27017/db";

////console.log(path.join(__dirname, 'CERIGame/app/views'));

// View Engine
app.set(path.join(__dirname, "CERIGame/app/views"));
//app.set('view engine', 'ejs');
//app.engine('html', require('ejs').renderFile);

// Set Static Folder
app.use(express.static(path.join(__dirname, "CERIGame/app/views")));

// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// parse application/json
app.use(bodyParser.json());

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Get username and password from login page
app.post("/api/login", function (request, response) {
  console.log("Body id : " + request.body.id);
  console.log("Body mdp : " + request.body.mdp);
  console.log("db.dbNameUsers : " + db.dbNameUsers);

  var identifiant = request.body.id;
  var motdepasse = request.body.mdp;

  if (identifiant == null) {
    console.log("ERREUR: Identifiant est null.");
    return;
  }

  if (motdepasse == null) {
    console.log("ERREUR: Motdepasse est null.");
    return;
  }

  console.log(
    `SELECT * from ${
      db.dbNameUsers
    } where identifiant='${identifiant}' and motpasse='${sha1(motdepasse)}'`
  );

  client = db.createClient();
  client.connect();
  client.query(
    `SELECT * from ${
      db.dbNameUsers
    } where identifiant='${identifiant}' and motpasse='${sha1(motdepasse)}'`,
    (err, res) => {
      response.send(res.rows);
      client.end();
    }
  );

  return;
});

// Get questions from mangodb
app.post("/api/getQuestions", function (request, response) {
  console.log("Types of questions : " + request.body.difficulty);

  if (request.body.difficulty == null) {
    console.log("ERREUR: Type of question is null.");
    return;
  }

  client = mongo.MongoClient;
  client.connect(mongoUrl, function (err, db) {
    if (err) throw err;
    console.log("hello there");
    var dbo = db.db("db");
    console.log("fetching quizz collection");
    dbo
      .collection("quizz")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        response.send(result);
        db.close();
      });
  });

  return;
});

// Quizz has ended, time to register info on pgsql
app.post("api/quizzEnded", function (request, response) {
  console.log("Body id : " + request.body.score);
  var id = request.body.id
  var nbAnswers = request.body.goodAnswer
  var time = request.body.timer
  var score = request.body.score

  if (score == null) {
    console.log("ERREUR: score est null.");
    return;
  }
  if (id == null) {
    console.log("ERREUR: id est null.");
    return;
  }

  client = db.createClient();
  client.connect();
  client.query(
    `INSERT INTO ${db.dbNameHistorique} VALUES (${id}, ${moment().format()}, ;`,
    (err, res) => {
      response.send(res.rows);
      client.end();
    }
  );

  return;
});

async function printTable() {
  client = db.createClient();

  try {
    console.log("Trying to use printTable function.");
    await client.connect();
    await client.query("BEGIN");
    console.log("Connected successfully.");
    const results = await client.query(`select * from ${db.dbNameUsers}`);
    console.log(results.rows);
    await client.query("COMMIT");
  } catch (e) {
    console.log(`Something wrong happened ${e}`);
    await client.query("ROLLBACK");
  } finally {
    await client.end();
    console.log("Client disconnected successfully");
  }
}

async function addMember(
  identifiant,
  motpasse,
  nom,
  prenom,
  date_de_naissance,
  statut,
  humeur
) {
  if (identifiant == null) {
    console.log("Identifiant est null. Impossible d'ajouter ce membre.");
    return;
  }

  client = createClient();

  try {
    console.log("Trying to use addMember function.");
    await client.connect();
    await client.query("BEGIN");
    console.log("Connected successfully.");
    await client.query(
      `INSERT INTO basic1 (identifiant, motpasse, nom, prenom, date_de_naissance, statut, humeur) VALUES ('${identifiant}', '${motpasse}', '${nom}', '${prenom}', TO_DATE('${date_de_naissance}', 'DD/MM/YYYY'), '${statut}', '${humeur}'); `
    );
    await client.query("COMMIT");
    console.log("Member added successfully.");
  } catch (e) {
    console.log(`Something wrong happened ${e}`);
    await client.query("ROLLBACK");
  } finally {
    await client.end();
    console.log("Client disconnected successfully");
    printTable();
  }
}

async function deleteMember(identifiant) {
  if (identifiant == null) {
    console.log("Identifiant est null. Impossible de supprimer ce membre.");
    return;
  }

  client = createClient();

  try {
    console.log("Trying to use addMember function.");
    await client.connect();
    await client.query("BEGIN");
    console.log("Connected successfully.");
    await client.query(`DELETE FROM basic1 WHERE identifiant='${identifiant}'`);
    await client.query("COMMIT");
    console.log("Member added successfully.");
  } catch (e) {
    console.log(`Something wrong happened ${e}`);
    await client.query("ROLLBACK");
  } finally {
    await client.end();
    console.log("Client disconnected successfully");
    printTable();
  }
}