const Category = require("../models/category");
const {Article} = require("../models/article");
const {check, validationResult} = require("express-validator");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(402).json({
        error: "category not found",
      });
    }
    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      parameter: errors.array()[0].param,
    });
  }

  let category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(402).json({
        error: "failed to save category",
      });
    }
    res.json(category);
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find((err, categories) => {
    if (err) {
      return res.status(402).json({
        error: "failed to get Category",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  Category.findByIdAndUpdate(
    {_id: req.category._id},
    {$set: req.body},
    {new: true, useFindAndModify: false},
    (err, category) => {
      if (err) {
        return res.status(402).json({
          error: "failed to update category",
        });
      }
      res.json(category);
    }
  );
};

exports.deleteCategory = (req, res) => {
  let category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.status(402).json({
        error: "failed to delete category",
      });
    }

    res.status(200).json({
      message: `Succesfully deleted ${category.name}`,
    });
  });
};

exports.getAllArticles = (req, res) => {
  Article.find({categoryid: req.category._id})
    .populate("userid", "_id name")
    .populate("categoryid", "_id name")
    .exec((err, articles) => {
      if (err) {
        return res.status(400).json({
          error: "failed to find articles",
        });
      }
      res.json(articles);
    });
};
