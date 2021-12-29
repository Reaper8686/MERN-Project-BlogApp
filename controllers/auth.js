const User = require("../models/user");
const {check, validationResult} = require("express-validator");
let expressJwt = require("express-jwt");
let jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signUp = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      parameter: errors.array()[0].param,
    });
  }
  const user = new User(req.body);
  user.save((error, user) => {
    if (error) {
      return res.status(402).json({
        error: "Username is taken",
      });
    }
    let {_id, name, username, email} = user;
    console.log("sdasdfasda");
    res.json({_id, name, username, email});
  });
};

exports.signIn = (req, res) => {
  let {username, password} = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      parameter: errors.array()[0].param,
    });
  }

  User.findOne({username}, (error, user) => {
    if (error || !user) {
      return res.status(402).json({
        error: "user not found",
      });
    }

    if (!user.authentication(password)) {
      return res.status(402).json({
        error: "password and username dont match",
      });
    }

    //genrating token
    const token = jwt.sign({_id: user._id}, process.env.SECRET);

    //genrating cookie
    res.cookie("token", token, {expire: new Date() + 9999});

    //Response
    let {_id, name, username, email} = user;
    return res.json({token, user: {_id, name, username, email}});
  });
};

exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "user signout succes",
  });
};

// protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//custom middleware
exports.isAuthenticate = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};
