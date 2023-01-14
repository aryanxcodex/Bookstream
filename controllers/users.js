const User = require("../models/users");
const sendEmail = require("../nodemailer/index");
const Books = require("../models/books");
const waitingList = require("../models/waitinglist");

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

module.exports.renderDashboard = async (req,res)=>{
  const numOfBooks = await Books.countDocuments({});
  res.render('users/dashboard', { numOfBooks } );
};


module.exports.renderBooksPage = async (req,res)=>{
  const books = await Books.find({});
  res.render('users/books', { books });
};

module.exports.renderShowBooksPage = async (req, res)=>{
  const user = await User.findById(req.user._id);
  const list = await waitingList.find({ user: req.user._id }).populate('book');
  const { id } = req.params;
  const book = await Books.findById(id);
  res.render('users/showbooks', { book, user, list });
};

module.exports.requestBook = async(req,res) =>{
  const bookid = req.params.id; 
  const userid = req.user._id;
  const list = await waitingList.insertMany([{user: userid, book: bookid}]);
  if(list) {
    res.send("made a request");
  } else {
    res.send("nahi hua bhai");
  }
};

