// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const md5 = require("md5");

// Create Express app
const app = express();

// Configure Express app
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB database
mongoose.connect("mongodb://localhost:27017/peerDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define Mongoose schemas and models
const studentSchema = {
  name: String,
  email: String,
  password: String,
  coins: Number
};
const Peer = mongoose.model("Peer", studentSchema);

const querySchema = {
  query: String,
  askedBy: String,
  answered: Boolean
};
const Query = mongoose.model("Query", querySchema);

const solutionSchema = {
  query: String,
  solution: String,
  answeredBy: String,
  liked: Boolean,
  disliked: Boolean
};
const Solution = mongoose.model("Solution", solutionSchema);

const noSol = new Solution({
  query: "No",
  solution: "No one answered this query",
  answeredBy: "No one",
  liked: false,
  disliked: false
});
db.getCollection('login').find({});
// Define routes

// Home route
app.get("/", function (req, res) {
  res.render("home");
});

// Login route
app.get("/login", function (req, res) {
  res.render("login");
});

// Registration route
app.get("/register", function (req, res) {
  res.render("register");
});

 // Register new peer
app.post("/register", function (req, res) {
  const newPeer = new Peer({
    name: req.body.peername,
    email: req.body.peermail,
    password: md5(req.body.password), // Assuming md5 is defined elsewhere
    coins: 10
  });

  newPeer.save(function (err) {
    if (!err) {
      Peer.find({}, function (er, foundPeers) {
        if (er) {
          console.log(er);
        } else {
          if (foundPeers.length == 1) {
            noSol.save(function (e) {
              if (e) {
                console.log(e);
              }
            });
          }
        }
      });
      res.redirect("/login");
    } else {
      res.send(err);
    }
  });
});

// Login authentication
app.post("/login", function (req, res) {
  const peerMail = req.body.peermail;
  const peerPassword = req.body.password;

  Peer.findOne({ email: peerMail }, function (err, foundPeer) {
    if (!err) {
      if (foundPeer) {
        if (foundPeer.password === md5(peerPassword)) {
          currentPeer = foundPeer.name;
          currentPeerCoins = foundPeer.coins;
          res.render("profile", {
            Peer: currentPeer,
            Coins: currentPeerCoins
          });
        } else {
          res.render("loginIn");
        }
      } else {
        res.render("loginIn");
      }
    } else {
      console.log(err);
    }
  });
});


// Profile route
app.get("/profile/:user", function (req, res) {
  const username = req.params.user;
  Peer.findOne({ name: username }, function (err, foundPeer) {
    if (!err) {
      if (foundPeer) {
        res.render("profile", {
          username: foundPeer.name,
          email: foundPeer.email,
          coins: foundPeer.coins
        });
      } else {
        res.render("profileNotFound");
      }
    } else {
      console.log(err);
      res.render("error");
    }
  });
});

// Logout route
app.get("/logout", function (req, res) {
  res.redirect("/");
});

// Start the server
app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
