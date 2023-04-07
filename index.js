const express = require("express"); // require express
const path = require("path"); // require path

var fs = require("fs"); // require file system

const app = express(); // create express app
const port = 3000; // set port

app.use(express.static("public")); // set static folder

app.get("/api/notes", function (req, res) { // get notes from db.json
  res.sendFile(path.join(__dirname, "./db/db.json")); // send notes to client
});

app.get("/notes", function (req, res) { // get notes path from client side and send notes.html first so wildcard doesn't take over
  res.sendFile(path.join(__dirname, "./public/notes.html")); // send notes.html to client
});

app.get("*", function (req, res) { // get all other paths from client side and send index.html
  res.sendFile(path.join(__dirname, "./public/index.html")); // send index.html to client
});

app.listen(port, () => { // listen on port
  console.log(`Example app listening on port ${port}`); // log port
});
