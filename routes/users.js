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

const authenticatecollegeid = async (req,res,next) => {
  const collegeid = req.body.collegeid;
  const username = req.body.username;

  const user = await User.findOne({collegeid: collegeid, username: username});

  if(!user) {
     req.flash("error", "Invalid collegeid or username");
     return res.redirect("/user/login");
  } else {
    next();
  }
}



router.post(
  "/login",
  authenticatecollegeid,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/user/login",
  }),
  userController.login
);

router.get("/dashboard", isLoggedin , catchAsync(userController.renderDashboard));

router.get("/return-books", isLoggedin, catchAsync(userController.renderReturnBooks));

router.post("/return-books/:id", isLoggedin, catchAsync(userController.returnBook));

router.get("/books", isLoggedin, userController.renderBooksPage);

router.post("/user/books")

router.get("/books/:id", isLoggedin, catchAsync(userController.renderShowBooksPage));

router.post("/books/requestbook/:id", catchAsync(userController.requestBook));

router.post("/logout", (req,res)=> {
  delete req.session.user;
  req.flash("success", "Logged you out successfully");
  res.sendStatus(200);
});

router.post("/search", catchAsync(userController.search));

module.exports = router;
