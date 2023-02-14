const Admin = require("../models/admin");
const sendEmail = require("../nodemailer/index");
const waitingList = require("../models/waitinglist");
const User = require("../models/users");
const Book = require("../models/books");
const Books = require("../models/books");

module.exports.renderRegisterForm = (req, res) => {
  res.render("admin/register");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("admin/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = req.session.returnTo || "/admin/dashboard";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.renderWaitingListPage = async (req, res) => {
  const list = await waitingList.find({}).populate('user').populate('book');
  res.render('admin/waitingList', { list });
};

module.exports.approveRequest = async (req, res) => {
  const bookid = req.params.bookid;
  const userid = req.params.userid;
  const deleteditem = await waitingList.findOneAndDelete({ user: userid, book: bookid });
  // console.log("item deleted");
  const user = await User.findById(userid);
  const book = await Book.findById(bookid);
  const newBook = {
    bookid: bookid
  };
  const updateBookArray = await User.updateOne({ _id: userid }, { $push: { books_borrowed: newBook } });
  const updateUserArray = await Book.updateOne({ _id: bookid }, { $push: { users: userid } });
  sendEmail(user.email, `Your request for the book ${book.title} was approved!`);
  req.flash("success", "The request was approved!");
  res.redirect("/admin/waitingList");
};

module.exports.renderdashboard = async (req, res) => {
  const numOfBooks = await Books.countDocuments({});
  const numOfUsers = await User.countDocuments({});
  const blacklists = await User.find({isBlacklisted: true});
  const borrowedbooks = await Books.find({}).populate('users');
  res.render("admin/librarian-dashboard", { numOfBooks, numOfUsers, blacklists, borrowedbooks });
};

module.exports.rendermanagebooks = async (req,res) => {
  const books = await Books.find({});
  res.render("admin/manage-books", { books });
};

module.exports.addbook = async (req,res) => {
  const { title, ISBN, author, cat } = req.body;
  const authors = [author];
  const category = [cat];
  const addbook = await Books.insertMany({title, ISBN, authors, category });
  if(addbook) {
    req.flash("success","added the book successfully");
    res.redirect("/admin/manage-books");
  }
};
