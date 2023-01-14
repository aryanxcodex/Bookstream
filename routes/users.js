const express = require("express");
const router = express.Router();
const User = require("../models/users");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../nodemailer/index");
const userController = require("../controllers/users");
const passport = require('passport');
const { isLoggedin } = require("../middleware");

router.get("/register", userController.renderRegisterForm);

router.post("/register", catchAsync(userController.registerUser));

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/user/login",
  }),
  userController.login
);

router.get("/dashboard", isLoggedin , catchAsync(userController.renderDashboard));

router.get("/books", isLoggedin, userController.renderBooksPage);

router.get("/books/:id", isLoggedin, catchAsync(userController.renderShowBooksPage));

router.post("/books/requestbook/:id", catchAsync(userController.requestBook));



module.exports = router;
