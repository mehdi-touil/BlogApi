var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
var Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("./auth");
//CRUD OPerations
//get all posts
router.get("/", async function (req, res, next) {
  try {
    const posts = await Post.find({ status: 1 })
      .populate("author")
      .sort({ updatedAt: -1 });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//a post of certain author
router.get("/author/:id", verifyToken, async function (req, res, next) {
  try {
    if (req.params.id == req.headers.userid) {
      const posts = await Post.find({
        author: req.params.id,
      })
        .populate("author")
        .sort({ updatedAt: -1 });
      res.json({ posts });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//get a certain post
router.get("/:id", async function (req, res, next) {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author comments.author",
      "fullname"
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// add a post
router.post("/", verifyToken, async function (req, res, next) {
  const post = new Post(req.body);

  try {
    const postToSave = await post.save();
    res.status(200).json(postToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// add a comment
router.post("/:id/comments", verifyToken, async function (req, res, next) {
  const comment = { author: req.body.author, content: req.body.content };
  try {
    var post = await Post.findById(req.params.id).populate(
      "author comments.author",
      "fullname"
    );
    post.comments.push(comment);
    await post.save();
    await post.populate("comments.author", "fullname");
    res.status(200).json(post.comments[post.comments.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// delete all
/*router.delete("/", async function (req, res, next) {
  const deletedPosts = await Post.deleteMany();
  if (!deletedPosts) {
    res.status(404).send({
      message: `Cannot delete all posts `,
    });
  }
  res.json({ deletedPosts });
});*/
//delete a post
router.delete("/:id", verifyToken, async function (req, res, next) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      res.status(404).send({
        message: `post was not found!`,
      });
    }
    res.status(200).json({ deletedPost });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// update a post
router.put("/:id", verifyToken, async function (req, res, next) {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    const updatedPost = await Post.findByIdAndUpdate(id, updatedData, options);
    res.send(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
