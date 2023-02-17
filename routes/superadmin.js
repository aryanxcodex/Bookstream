const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport"); 
const superadminController = require("../controllers/superadmin");


router.get("/login",superadminController.renderloginpage);

router.post("/dashboard/librarian-form", superadminController.registeradmin);


router.post(
    "/login",
    passport.authenticate("superadmin", {
      failureFlash: true,
      failureRedirect: "/superadmin/login",
    }),
    superadminController.login  
);

router.get("/dashboard",superadminController.renderdashboard);

router.get("/dashboard/manage-librarians",superadminController.rendermanagelibrarians);

router.get("/dashboard/librarian-form",superadminController.renderlibrarianform);

// router.get("/aryan", catchAsync(superadminController.registerSuperadmin));






module.exports = router;