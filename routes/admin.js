const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../nodemailer/index");
const adminController = require("../controllers/admin");
const passport = require("passport"); 
const waitinglist = require("../models/waitinglist");


router.get("/register", adminController.renderRegisterForm);

router.post("/register", catchAsync(adminController.registerAdmin));

router.get("/login", adminController.renderLoginForm);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/admin/login",
  }),
  adminController.login
);

router.get('/waitinglist', catchAsync(adminController.renderWaitingListPage));

router.delete('/waitinglist/:userid/:bookid', catchAsync(adminController.approveRequest));

router.get('/dashboard', adminController.renderdashboard);

module.exports = router;