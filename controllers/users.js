const User = require("../models/users");
const sendEmail = require("../nodemailer/index");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.registerUser = async (req, res) => {
  const { email, username, password, dept} = req.body;
  const user = new User({ email, username, dept });
  const registeredUser = await User.register(user, password);
  if (registeredUser) {
    sendEmail(email);
  }
  req.flash("success", "Welcome to bookstream");
  res.redirect("/");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = req.session.returnTo || "/";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};
