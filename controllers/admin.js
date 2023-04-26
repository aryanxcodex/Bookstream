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
  const redirectUrl = req.session.returnTo || "/admin/dashboard";
  delete req.session.returnTo;
  req.session.admin = true;
  req.session.collegeid = req.body.collegeid;
  req.session.username = req.body.username;
  res.redirect(redirectUrl);
};

module.exports.renderWaitingListPage = async (req, res) => {
  const list = await waitingList.find({}).populate('user').populate('book');
  res.render('admin/waitingList', { list });
};

module.exports.approveRequest = async (req, res) => {
  const collegeid = req.session.collegeid;
  const bookid = req.params.bookid;
  const userid = req.params.userid;
  const deleteditem = await waitingList.findOneAndDelete({ collegeid: collegeid, user: userid, book: bookid });
  if (deleteditem) {
    const user = await User.findById(userid);
    const book = await Book.findById(bookid);
    const newBook = {
      bookid: bookid
    };
    const updateBookArray = await User.updateOne({ _id: userid }, { $push: { books_borrowed: newBook } });
    const updateUserArray = await Book.updateOne({ _id: bookid }, { $inc: { stock: -1 }, $push: { users: userid } });
    sendEmail(user.email, `Your request for the book ${book.title} was approved!`);
    req.flash("success", "The request was approved!");
    res.redirect("/admin/manage-requests");
  } else {
    req.flash("error", "Can't approve request something went wrong");
    res.redirect("/admin/manage-requests");
  }
};

module.exports.renderdashboard = async (req, res) => {
  const collegeid = req.session.collegeid;
  const username = req.session.username;
  const numOfBooks = await Books.countDocuments({collegeid: collegeid});
  const numOfUsers = await User.countDocuments({collegeid: collegeid});
  const blacklists = await User.find({ collegeid: collegeid, isBlacklisted: true });
  const borrowedbooks = await Books.find({collegeid: collegeid}).populate('users');
  res.render("admin/librarian-dashboard", { numOfBooks, numOfUsers, blacklists, borrowedbooks, username});
};

module.exports.rendermanagebooks = async (req, res) => {
  const username = req.session.username;
  const collegeid = req.session.collegeid;
  const books = await Books.find({collegeid: collegeid});
  res.render("admin/manage-books", { books, username });
};

module.exports.rendermanagerequests = async (req, res) => {
  const collegeid = req.session.collegeid;
  const username = req.session.username;
  const list = await waitingList.find({collegeid: collegeid}).populate('user').populate('book');
  res.render("admin/manage-requests", { list, username });
};

module.exports.rendermanagesections = (req, res) => {
  const username = req.session.username;
  res.render("admin/manage-sections", { username });
};

module.exports.rendermanagestudents = (req, res) => {
  const username = req.session.username;
  res.render("admin/manage-students", { username });
};

module.exports.renderoverduebooks = async (req, res) => {
  const collegeid = req.session.collegeid;
  const username = req.session.username;
  const today = new Date();
  const users = await User.find({
    collegeid: collegeid,
    'books_borrowed.returnAt': { $lt: today },
    isBlacklisted: false,
  });
  res.render("admin/overdue-books", { users, username });
};

module.exports.renderrequestbooks = async (req, res) => {
  const collegeid = req.session.collegeid;
  const username = req.session.username;
  const list = await waitingList.find({collegeid: collegeid}).populate('user').populate('book');
  res.render("admin/request-book", { list, username });
};

module.exports.addbook = async (req, res) => {
  const { title, ISBN, author, cat } = req.body;
  const authors = [author];
  const category = [cat];
  const addbook = await Books.insertMany({ title, ISBN, authors, category });
  if (addbook) {
    req.flash("success", "added the book successfully");
    res.redirect("/admin/manage-books");
  }
};


module.exports.search = async (req,res) => {
  const collegeid = req.session.collegeid;
  const { search } = req.body;
  const username = req.session.username;
  const searchCriteria = {
    collegeid: collegeid,
  };

  if (search) {
    searchCriteria.title = { $regex: search, $options: 'i' }; // Case-insensitive regex search on title
  }

  const books = await Book.find(searchCriteria);

  res.render("admin/manage-books", { books, username });
}

module.exports.rejectRequest = async (req,res) => {
  const collegeid = req.session.collegeid;
  const bookid = req.params.bookid;
  const userid = req.params.userid;
  const message = req.body.message;
  const deleteditem = await waitingList.findOneAndDelete({ collegeid: collegeid, user: userid, book: bookid });
  if(deleteditem) {
    const user = await User.findById(userid);
    const book = await Book.findById(bookid);
    sendEmail(user.email, `Your request for the book ${book.title} has been rejected due to the following reason mentioned by the admin "${message}"`);
    req.flash("success", "The request was rejected");
    res.redirect("/admin/manage-requests");
  } else {
    req.flash("error", "The rejection was not successfull");
    res.redirect("/admin/manage-requests");
  }
};