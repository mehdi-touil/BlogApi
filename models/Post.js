const mongoose = require("mongoose");
const { Schema } = mongoose;
const PostSchema = new Schema(
  {
    title: { type: String, required: true }, // String is shorthand for {type: String}
    content: { type: String, required: true },
    status: { type: String, default: "0" },
    author: { type: Schema.Types.ObjectId, ref: "Author" },
    comments: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
        content: String,
        timestamp: {
          type: String,
          default: () => new Date().toUTCString(),
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
