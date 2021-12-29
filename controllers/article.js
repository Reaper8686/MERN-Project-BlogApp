const {Article, Comments} = require("../models/article");
const formidible = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.getArticleById = (req, res, next, id) => {
  Article.findById(id)
    .populate("categoryid", "_id name")
    .populate("userid", "_id name")
    .exec((err, article) => {
      if (err) {
        return res.status(400).json({
          error: "article not found",
        });
      }
      req.article = article;
      next();
    });
};

exports.createArticle = (req, res) => {
  let form = new formidible.IncomingForm();
  form.keepExtentsions = true;

  form.parse(req, (err, feilds, file) => {
    if (err) {
      return res.status(400).json({
        error: "error in image",
      });
    }

    const {title, article, userid, categoryid} = feilds;

    if (!title || !article || !userid || !categoryid) {
      return res.status(400).json({
        error: "fill feilds properly",
      });
    }

    let Sarticle = new Article(feilds);

    if (!file.photo) {
      return res.status(400).json({
        error: "photo is required",
      });
    }

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "photo is too big",
        });
      }

      Sarticle.photo.data = fs.readFileSync(file.photo.path);
      Sarticle.content_type = file.photo.type;
    }

    Sarticle.save((err, article) => {
      if (err) {
        return res.status(402).json({
          error: "failed to save article",
        });
      }
      res.json(article);
    });
  });
};

exports.getArticle = (req, res) => {
  req.article.photo = undefined;
  res.json(req.article);
};

exports.getAllArticles = (req, res) => {
  Article.find()
    .populate("categoryid", "_id name")
    .populate("userid", "_id name")
    .sort([["likes", "desc"]])
    .select("-photo")
    .exec((err, articles) => {
      if (err) {
        return res.status(402).json({
          error: "failed to get articles",
        });
      }
      res.json(articles);
    });
};

exports.updateArticle = (req, res) => {
  let form = new formidible.IncomingForm();
  form.keepExtentsions = true;

  form.parse(req, (err, feilds, file) => {
    if (err) {
      return res.status(400).json({
        error: "error in image",
      });
    }

    let article = req.article;
    article = _.extend(article, feilds);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "photo is too big",
        });
      }
      article.photo.data = fs.readFileSync(file.photo.path);
      article.content_type = file.photo.type;
    }

    article.save((err, article) => {
      if (err) {
        return res.status(402).json({
          error: "failed to update article",
        });
      }
      res.json(article);
    });
  });
};

exports.mostLikedArticles = (req, res) => {
  Article.find()
    .populate("userid", "_id name")
    .populate("categoryid", "_id name")
    .sort([["createdAt", "desc"]])
    .select("-photo")
    .exec((err, articles) => {
      if (err) {
        return res.status(400).json({
          error: "failed to get articles",
        });
      }
      res.json(articles);
    });
};

exports.deleteArticle = (req, res) => {
  let article = req.article;
  article.remove((err, article) => {
    if (err) {
      return res.status(402).json({
        error: "failed to delete article",
      });
    }
    res.json({
      message: `Succesfully deleted ${article.title}`,
    });
  });
};

//Comments Conrollers
exports.getCommentById = (req, res, next, id) => {
  Comments.findById(id)
    .populate("userid", "_id name")
    .populate("articleid", "_id name")
    .exec((err, comment) => {
      if (err) {
        return res.status(402).json({
          error: "comment not found",
        });
      }
      req.comment = comment;
      next();
    });
};

exports.createComment = (req, res) => {
  let comment = new Comments(req.body);
  comment.save((err, comment) => {
    if (err) {
      return res.status(402).json({
        error: "failed to save comment",
      });
    }
    res.json(comment);
  });
};

exports.getAllCommentsByArticle = (req, res) => {
  Comments.find({articleid: req.article._id})
    .populate("userid", "name")
    .populate("articleid", "title")
    .exec((err, comments) => {
      if (err) {
        return res.status(400).json({
          error: "failed to found comments",
        });
      }
      res.json(comments);
    });
};

exports.updateComment = (req, res) => {
  Comments.findByIdAndUpdate(
    {_id: req.comment._id},
    {$set: req.body},
    {new: true},
    (err, comment) => {
      if (err) {
        return res.status(402).json({
          error: "failed to delete comment",
        });
      }
      res.json(comment);
    }
  );
};

exports.deleteComment = (req, res) => {
  let comment = req.comment;
  comment.remove((err, comment) => {
    if (err) {
      return res.status(400).json({
        error: "failed to delete comment",
      });
    }
    res.json({
      message: `Successfully deleted ${comment.comment}`,
    });
  });
};

//likes Controller
exports.likeArticle = (req, res) => {
  let likes = [];
  likes.push({likedby: req.profile._id});

  Article.findByIdAndUpdate(
    {_id: req.article._id},
    {$push: {likes: likes}},
    {new: true, useFindAndModify: false},
    (err, article) => {
      if (err) {
        return res.json({
          error: "failed to like article",
        });
      }
      res.json({
        messsage: "Liked it",
      });
    }
  );
};

exports.getTotalLikes = (req, res) => {
  res.json(req.article.likes);
};

//middlewares
exports.photo = (req, res, next) => {
  if (req.article.photo.data) {
    res.set("Content-Type", req.article.photo.contentType);
    return res.send(req.article.photo.data);
  }
  next();
};
