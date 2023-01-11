const Admin = require("../models/admin");
const sendEmail = require("../nodemailer/index");

module.exports.renderRegisterForm = (req, res) => {
  res.render("admin/register");
};

module.exports.registerAdmin = async (req, res) => {
  const { email, username, password, dept } = req.body;
  const admin = new Admin({ email, username, dept });
  const registeredAdmin = await Admin.register(admin, password);
  if (registeredAdmin) {
    sendEmail(email);
  }
  req.flash("success", "Welcome to bookstream");
  res.redirect("/");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("admin/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = req.session.returnTo || "/";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};


