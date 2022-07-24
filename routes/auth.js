var express = require("express");
const Author = require("../models/Author");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.post("/login", async function (req, res, next) {
  // Our login logic starts here
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await Author.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;
      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});
router.post("/signup", async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { fullname, username, password, cpassword } = req.body;

    // Validate user input
    if (!(username && password && fullname && cpassword)) {
      res.status(400).send("All input is required");
    }
    if (password != cpassword) {
      res.status(400).send("Password mismatch");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await Author.findOne({ username });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password

    // Create user in our database
    const user = await Author.create({
      fullname,
      username: username,
      password: password,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, username },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;
    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
module.exports = { router, verifyToken };
