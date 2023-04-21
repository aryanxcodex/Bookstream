const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../nodemailer/index");
const adminController = require("../controllers/admin");
const passport = require("passport"); 
const waitinglist = require("../models/waitinglist");
const { isAdminLoggedin } = require("../middleware");
const Admin = require("../models/admin");

router.get("/register", catchAsync(adminController.renderRegisterForm));

// router.post("/register", catchAsync(adminController.registerAdmin));

router.get("/login", adminController.renderLoginForm);

const authenticatecollegeid = async (req,res,next) => {
  const collegeid = req.body.collegeid;
  const username = req.body.username;

  const user = await Admin.findOne({collegeid: collegeid, username: username});

  if(!user) {
     req.flash("error", "Invalid collegeid or username");
     return res.redirect("/admin/login");
  } else {
    next();
  }
}

router.post(
  "/login",
  authenticatecollegeid,
  passport.authenticate("admin", {
    failureFlash: true,
    failureRedirect: "/admin/login",
  }),
  adminController.login
);

router.get('/waitinglist', catchAsync(adminController.renderWaitingListPage));

router.delete('/waitinglist/:userid/:bookid', catchAsync(adminController.approveRequest));



router.get('/dashboard', isAdminLoggedin ,catchAsync(adminController.renderdashboard));

router.get('/manage-books',isAdminLoggedin, adminController.rendermanagebooks);

router.post('/manage-books', isAdminLoggedin, catchAsync(adminController.search));

router.get('/manage-requests',isAdminLoggedin, catchAsync(adminController.rendermanagerequests));

router.get('/manage-sections',isAdminLoggedin, adminController.rendermanagesections);

router.get('/manage-students',isAdminLoggedin, adminController.rendermanagestudents);

router.get('/overdue-books',isAdminLoggedin, catchAsync(adminController.renderoverduebooks));

router.get('/request-book',isAdminLoggedin, catchAsync(adminController.renderrequestbooks));

router.post('/addbook',isAdminLoggedin, adminController.addbook);

router.post('/logout', (req,res)=> {
  delete req.session.admin;
  req.flash("success", "Logged you out successfully");
  res.sendStatus(200);
});

module.exports = router;