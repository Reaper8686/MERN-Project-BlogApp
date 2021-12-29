const User = require("../models/user");
const {Article} = require("../models/article");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err) {
      return res.status(402).json({
        error: "user not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encrypt_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;

  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    {_id: req.profile._id},
    {$set: req.body},
    {new: true, useFindAndModify: false},
    (err, user) => {
      if (err) {
        return res.status(402).json({
          error: "failed to update user",
        });
      }
      user.salt = undefined;
      req.profile.encrypt_password = undefined;
      res.json(user);
    }
  );
};

exports.getArticleList = (req, res) => {
  Article.find({userid: req.profile._id})
    .populate("categoryid", "_id name")
    .populate("userid", "_id name")
    .exec((err, articles) => {
      if (err) {
        return res.status(402).json({
          error: "not found any Article",
        });
      }

      res.json(articles);
    });
};
