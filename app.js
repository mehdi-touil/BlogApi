var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var db = require("./db/db");
var postsRouter = require("./routes/posts");
var authorsRouter = require("./routes/authors");
var authentificationRouter = require("./routes/auth");
const cors = require("cors");
require("dotenv").config();
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: "*",
  })
);
app.use("/posts", postsRouter);
app.use("/authors", authorsRouter);
app.use("/", authentificationRouter.router);

module.exports = app;
