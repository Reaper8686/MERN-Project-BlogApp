const express = require("express");
const router = express.Router();
const {check} = require("express-validator");

const {signUp, signIn, signOut} = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name", "name should be more than 3 char").isLength({min: 3}),
    check("username", "name should be more than 3 char").isLength({min: 3}),
    check("email", "email is invalid").isEmail(),
    check("password", "password should more thsn 3 char").isLength({min: 3}),
  ],
  signUp
);

router.post(
  "/signin",
  [
    check("username", "username is invalid").isLength({min: 3}),
    check("password", "password is not correct").isLength({min: 3}),
  ],
  signIn
);

router.get("/signout", signOut);

module.exports = router;
