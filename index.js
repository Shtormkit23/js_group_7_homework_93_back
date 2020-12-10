const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const events = require("./app/events");
const users = require("./app/users");
const friends = require("./app/friends");
const config = require("./config");
const app = express();
const port = 8001;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const run = async () => {
  await mongoose.connect(config.db.url + "/" + config.db.name, {useNewUrlParser: true, autoIndex: true});

  app.use("/events", events);
  app.use("/users", users);
  app.use("/friends", friends);

  console.log("Connected to mongo DB");

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
};

run().catch(console.log);
