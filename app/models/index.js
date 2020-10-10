const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODB_URI;
db.events = require("./event.model.js")(mongoose);
db.officers = require("./officer.model.js")(mongoose);

module.exports = db;