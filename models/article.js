const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema;

let CommentsSchema = new mongoose.Schema(
  {
    userid: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
    articleid: {
      type: ObjectId,
      ref: "article",
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {timestamps: true}
);

const Comments = mongoose.model("comment", CommentsSchema);

let ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    article: {
      type: String,
      required: true,
      trim: true,
    },
    userid: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
    categoryid: {
      type: ObjectId,
      ref: "category",
      required: true,
    },
    likes: [],
    photo: {
      data: Buffer,
      content_type: String,
    },
  },
  {timestamps: true}
);

const Article = mongoose.model("article", ArticleSchema);

module.exports = {Comments, Article};
