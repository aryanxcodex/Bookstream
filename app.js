if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users");
const Admin = require("./models/admin");
const SuperAdmin = require("./models/superadmin");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const ExpressError = require('./utils/ExpressError');
const catchAsync = require("./utils/catchAsync");
const superadminRoutes = require("./routes/superadmin");
const sendEmail = require("./nodemailer/index");

mongoose.connect(process.env.MONGODB_URI);

const sessionConfig = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    admin: false,
    superadmin: false,
    user: false
  },
};

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use("local", new LocalStrategy(User.authenticate()));
passport.use("admin", new LocalStrategy(Admin.authenticate()));
passport.use("superadmin", new LocalStrategy(SuperAdmin.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

passport.serializeUser(SuperAdmin.serializeUser());
passport.deserializeUser(SuperAdmin.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'];
  const isMobile = /mobile/i.test(userAgent);

  if (isMobile) {
    res.send('<h1>Please access this site on a desktop browser for the best experience.</h1>');
  } else {
    next();
  }
});

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/superadmin", superadminRoutes);

app.get("/", (req, res) => {

  if(req.session.user) {
    res.redirect("/user/dashboard");
  }

  if(req.session.admin) {
    res.redirect("admin/dashboard");
  }

  if(req.session.superadmin) {
    res.redirect("superadmin/dashboard");
  }


  res.render("home");
});

app.get("/login", (req,res)=>{
  res.render("login");
});

app.get("/register", (req,res)=>{
  res.render("sign-up");
});

app.get("/onboarding", (req,res)=>{
  res.render("onboarding");
});

app.post("/feedback", async (req,res) => {
  const email = "ganeshgajelly66@gmail.com";
  const { feedback } = req.body;
  sendEmail(email,feedback);
  res.redirect('/');
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(process.env.PORT, () => {
  console.log("Server Running on Port 3000");
});
