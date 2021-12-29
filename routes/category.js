const express = require("express");
const router = express.Router();
const {check} = require("express-validator");

const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
  getAllArticles,
} = require("../controllers/category");
const {isSignedIn, isAuthenticate} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

router.param("categoryId", getCategoryById);
router.param("userId", getUserById);

router.post(
  "/category/create/:userId",
  [check("name", "name should be more than 3 char").isLength({min: 3})],
  isSignedIn,
  isAuthenticate,
  createCategory
);

router.get("/category/:categoryId", getCategory);

router.get("/categories", getAllCategory);

router.put(
  "/category/update/:categoryId/:userId",
  isSignedIn,
  isAuthenticate,
  updateCategory
);

router.delete(
  "/category/delete/:categoryId/:userId",
  isSignedIn,
  isAuthenticate,
  deleteCategory
);

router.get("/category/articles/:categoryId", getAllArticles);

module.exports = router;
