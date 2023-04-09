const express = require("express"); // require express
const path = require("path"); // require path
const fs = require("fs"); // require fs

const app = express(); // create express app
const port = server.listen(process.env.PORT || 3000);

// app.use(express.static("public")); // set static folder
// app.use(express.json()); // parse JSON

// app.get("/api/notes", function (req, res) {
//   // get notes from db.json
//   res.sendFile(path.join(__dirname, "./db/db.json")); // send notes to client
// });

// app.delete("/api/notes/:id", function (req, res) {
//   // get delete request from client, delete note from db.json

//   fs.readFile("./db/db.json", "utf8", (err, data) => {
//     // read db.json
//     if (err) throw err; // throw error if error
//     const notes = JSON.parse(data); // parse db.json
//     const newNotes = notes.filter((note) => note.id !== req.params.id); // filter out note with id from notes array

//     fs.writeFile("./db/db.json", JSON.stringify(newNotes), (err) => {
//       // write new notes array to db.json
//       if (err) throw err; // throw error if error
//       res.status(200).json({ success: "Note successfully deleted!" });
//     });
//   });
// });

// app.post("/api/notes", function (req, res) {
//   // get post request from client, add note to db.json

//   fs.readFile("./db/db.json", "utf8", (err, data) => {
//     // read db.json
//     if (err) throw err; // throw error if error
//     const notes = JSON.parse(data); // parse db.json
//     notes.push(req.body); // push new note to notes array

//     fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
//       // write new notes array to db.json
//       if (err) throw err; // throw error if error
//       res.status(200).json({ success: "Note successfully saved!" });
//     });
//   });
// });

// app.get("/notes", function (req, res) {
//   // get notes path from client side and send notes.html first so wildcard doesn't take over
//   res.sendFile(path.join(__dirname, "./public/notes.html")); // send notes.html to client
// });

// app.get("*", function (req, res) {
//   // get all other paths from client side and send index.html
//   res.sendFile(path.join(__dirname, "./public/index.html")); // send index.html to client
// });

app.listen(port, () => {
  // listen on port
  console.log(`Example app listening on port ${port}`); // log port
});
