const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/BLOGAPI", () => {
  console.log("connected to DB");
});
var db = mongoose.connection;
exports.default = db;
