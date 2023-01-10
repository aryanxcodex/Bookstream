const express = require("express");
const router = express.Router();
const User = require("../models/users");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../nodemailer/index");
const userController = require("../controllers/users");
const passport = require('passport');

router.get("/register", userController.renderRegisterForm);

router.post("/register", catchAsync(userController.registerUser));

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  userController.login
);

module.exports = router;
