module.exports.isLoggedin = (req, res, next) => {
  if (!req.session.user) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "you must be signed in first");
    return res.redirect("/");
  }
  next();
};


module.exports.isAdminLoggedin = (req, res, next) => {
  if(!req.session.admin) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in as an admin");
    return res.redirect("/");
  }
  next();
};