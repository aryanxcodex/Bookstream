const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport"); 
const superadminController = require("../controllers/superadmin");
const SuperAdmin = require("../models/superadmin");
const { isSuperAdminLoggedin } = require("../middleware");

router.get("/login",superadminController.renderloginpage);

router.post("/dashboard/librarian-form", superadminController.registeradmin);


const authenticatecollegeid = async (req,res,next) => {
  const collegeid = req.body.collegeid;
  const username = req.body.username;

  const user = await SuperAdmin.findOne({collegeid: collegeid, username: username});

  if(!user) {
     req.flash("error", "Invalid collegeid or username");
     return res.redirect("/superadmin/login");
  } else {
    next();
  }
}



router.post(
    "/login",
    authenticatecollegeid,
    passport.authenticate("superadmin", {
      failureFlash: true,
      failureRedirect: "/superadmin/login",
    }),
    superadminController.login  
);

router.get("/dashboard", isSuperAdminLoggedin ,superadminController.renderdashboard);

router.get("/dashboard/manage-librarians", isSuperAdminLoggedin ,superadminController.rendermanagelibrarians);

router.get("/dashboard/librarian-form", isSuperAdminLoggedin ,superadminController.renderlibrarianform);

router.get("/aryan", catchAsync(superadminController.registerSuperadmin));

router.post("/superadmin/logout", (req,res)=> {
  delete req.session.superadmin;
  req.flash("success", "Logged you out successfully");
  res.sendStatus(200);
});




module.exports = router;