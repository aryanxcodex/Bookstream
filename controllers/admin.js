const Admin = require("../models/admin");
const sendEmail = require("../nodemailer/index");
const waitingList = require("../models/waitinglist");
const User = require("../models/users");
const Book = require("../models/books");

module.exports.renderRegisterForm = (req, res) => {
  res.render("admin/register");
};

module.exports.registerAdmin = async (req, res) => {
  const { email, username, password, dept } = req.body;
  const admin = new Admin({ email, username, dept });
  const registeredAdmin = await Admin.register(admin, password);
  if (registeredAdmin) {
    sendEmail(email, `You are now an admin of ${dept} Department`);
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

module.exports.renderWaitingListPage = async (req,res) => {
  const list = await waitingList.find({}).populate('user').populate('book');
  res.render('admin/waitingList', { list });
};

module.exports.approveRequest = async (req,res)=>{
  const bookid = req.params.bookid;
  const userid = req.params.userid;
  const deleteditem = await waitingList.findOneAndDelete({user: userid, book: bookid});
  console.log("item deleted");
  res.send("done!");
  const user = await User.findById(userid);
  const book = await Book.findById(bookid);
  const newBook = {
    bookid: bookid
  };
  const newUser = {
    userid
  };
  const updateBookArray = await User.updateOne({_id: userid}, { $push: { books_borrowed: newBook}});
  const updateUserArray = await Book.updateOne({_id: bookid}, { $push: { users: newUser }});
  sendEmail(user.email, `Your request for the book ${book.title} was approved!`);
};
