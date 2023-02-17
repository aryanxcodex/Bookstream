const User = require("../models/users");
const sendEmail = require("../nodemailer/index");
const Books = require("../models/books");
const waitingList = require("../models/waitinglist");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/student-register");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { collegeid, email, username, password, dept, phone} = req.body;
    const user = new User({ collegeid, phone, email, username, dept });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Bookstream!");
      res.redirect("/user/dashboard");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/user/register");
  }
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = req.session.returnTo || "/user/dashboard";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.renderDashboard = async (req,res)=>{
  const user = await User.findById(req.user._id);
  const list = await waitingList.find({ user: req.user._id }).populate('book');
  const { id } = req.params;
  const book = await Books.findById(id);
  const books = await Books.find({});
  const numOfBooks = await Books.countDocuments({});
  res.render('users/dashboard', { numOfBooks, books, book, user, list } );
};


module.exports.renderBooksPage = async (req,res)=>{
  const { title } = req.body;
  const filterObj = {};
  filterObj.title = new RegExp(title, 'i');
  const books = await Books.find(filterObj);
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
    req.flash("success", "Your request was made !");
    res.redirect("/user/dashboard");
  } else {
    res.flash("error", "Error processing request");
    res.redirect("/user/dashboard");
  }
};

