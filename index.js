const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");



const app = express();

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

// app.use("/public", express.static(__dirname + "/views/public"));


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  // Code for registering a new Peer
  res.send("Registration successful!");
});

app.post("/login", function (req, res) {
  // Code for handling user login
});

app.get("/profile/:user", function (req, res) {
  // Code for rendering user profile
  const username = req.params.user;
  res.render("profile", { username: username });
});

// More route definitions...

app.get("/logout", function (req, res) {
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("server is running at port 3000");
});
