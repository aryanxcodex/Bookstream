const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../nodemailer/index");
const adminController = require("../controllers/admin");
const passport = require("passport"); 
const waitinglist = require("../models/waitinglist");


router.get("/register", catchAsync(adminController.renderRegisterForm));

// router.post("/register", catchAsync(adminController.registerAdmin));

router.get("/login", adminController.renderLoginForm);

router.post(
  "/login",
  passport.authenticate("admin", {
    failureFlash: true,
    failureRedirect: "/admin/login",
  }),
  adminController.login
);

router.get('/waitinglist', catchAsync(adminController.renderWaitingListPage));

router.delete('/waitinglist/:userid/:bookid', catchAsync(adminController.approveRequest));



router.get('/dashboard', catchAsync(adminController.renderdashboard));

router.get('/manage-books', adminController.rendermanagebooks);

router.get('/manage-requests', catchAsync(adminController.rendermanagerequests));

router.get('/manage-sections', adminController.rendermanagesections);

router.get('/manage-students', adminController.rendermanagestudents);

router.get('/overdue-books', catchAsync(adminController.renderoverduebooks));

router.get('/request-book', catchAsync(adminController.renderrequestbooks));

router.post('/addbook', adminController.addbook);

module.exports = router;