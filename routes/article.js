const express = require("express");
const router = express.Router();

const {
  getArticleById,
  createArticle,
  getArticle,
  getAllArticles,
  updateArticle,
  deleteArticle,
  getCommentById,
  createComment,
  getAllCommentsByArticle,
  mostLikedArticles,
  updateComment,
  deleteComment,
  likeArticle,
  getTotalLikes,
  photo,
} = require("../controllers/article");
const {isSignedIn, isAuthenticate} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

// Article Routes
//params
router.param("userId", getUserById);
router.param("articleId", getArticleById);

//post
router.post(
  "/article/create/:userId",
  isSignedIn,
  isAuthenticate,
  createArticle
);

//read
router.get("/article/:articleId", getArticle);
router.get("/articles", getAllArticles);
router.get("/article/photo/:articleId", photo);
router.get("/articles/bylikes", mostLikedArticles);

//update
router.put(
  "/article/update/:articleId/:userId",
  isSignedIn,
  isAuthenticate,
  updateArticle
);

//delete
router.delete(
  "/article/delete/:articleId/:userId",
  isSignedIn,
  isAuthenticate,
  deleteArticle
);

// Comments Routes
//params
router.param("commentId", getCommentById);

//post
router.post(
  "/comment/create/:userId",
  isSignedIn,
  isAuthenticate,
  createComment
);

//read
router.get("/comments/:articleId", getAllCommentsByArticle);

//update
router.put(
  "/comment/update/:commentId/:userId",
  isSignedIn,
  isAuthenticate,
  updateComment
);

//delete
router.delete(
  "/comment/delete/:commentId/:userId",
  isSignedIn,
  isAuthenticate,
  deleteComment
);

// //Likes Router
router.put(
  "/likeit/:articleId/:userId",
  isSignedIn,
  isAuthenticate,
  likeArticle
);

router.get("/like/:articleId", getTotalLikes);

module.exports = router;
