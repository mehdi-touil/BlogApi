var express = require("express");
var router = express.Router();
var Author = require("../models/Author");
//CRUD OPerations
router.get("/", async function (req, res, next) {
  try {
    const authors = await Author.find({});
    res.json({ authors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async function (req, res, next) {
  const author = new Author(req.body);
  try {
    const authorToSave = await author.save();
    res.status(200).json(authorToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// router.delete("/", async function (req, res, next) {
//   const deletedAuthors = await Author.deleteMany();
//   if (!deletedAuthors) {
//     res.status(404).send({
//       message: `Cannot delete all authors `,
//     });
//   }
//   res.json({ deletedAuthors });
// });

// router.delete("/:id", async function (req, res, next) {
//   try {
//     const id = req.params.id;
//     if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
//     const deletedAuthor = await Author.findByIdAndDelete(id);
//     if (!deletedAuthor) {
//       res.status(404).send({
//         message: `Author was not found!`,
//       });
//     }
//     res.status(200).json({ deletedAuthor });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// router.put("/:id", async function (req, res, next) {
//   const author = await Author.findById(req.params.id);
//   try {
//     const id = req.params.id;
//     const updatedData = req.body;
//     const options = { new: true };
//     const updatedAuthor = await Author.findByIdAndUpdate(
//       id,
//       updatedData,
//       options
//     );
//     res.send(updatedAuthor);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
module.exports = router;
