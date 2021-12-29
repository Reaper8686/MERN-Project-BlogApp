const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  getArticleList,
} = require("../controllers/user");
const {isSignedIn, isAuthenticate} = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticate, getUser);

router.put("/user/update/:userId", isSignedIn, isAuthenticate, updateUser);

router.get("/user/artilelist/:userId", getArticleList);

module.exports = router;
