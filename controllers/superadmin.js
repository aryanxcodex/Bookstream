const Superadmin = require("../models/superadmin");
const Admin = require("../models/admin");
const sendEmail = require("../nodemailer");
const User = require("../models/users");

module.exports.login = (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = req.session.returnTo || "/superadmin/dashboard";
    delete req.session.returnTo;
    req.session.superadmin = true;
    // req.session.collegeid = req.body.collegeid;
    res.redirect(redirectUrl);
};

module.exports.renderdashboard = async (req,res)=>{
    const numOfAdmins = await Admin.countDocuments({});
    const numOfUsers = await User.countDocuments({});
    const librarians = await Admin.find({});
    const students = await User.find({});
    res.render("superadmin/super-dashboard", { numOfAdmins, numOfUsers, librarians, students });
};

module.exports.rendermanagelibrarians = async (req,res)=> {
    const librarians = await Admin.find({});
    res.render("superadmin/manage-librarians", { librarians });
};

module.exports.renderloginpage = (req,res)=>{
    res.render("superadmin/login");
};

module.exports.renderlibrarianform = (req,res)=>{
    res.render("superadmin/librarian-form");
};

module.exports.registeradmin = async (req,res)=>{
    const { email, username, password, dept, phone, collegeid} = req.body;
    const admin = await Admin.findOne({collegeid: collegeid, username: username});
    if(admin) {
        req.flash("error", "Admin already exists with these credentials");
        return res.redirect("/superadmin/dashboard/librarian-form");
    }
    const registeredAdmin = new Admin({username, email, dept, phone, collegeid});
    await registeredAdmin.setPassword(password);
    await registeredAdmin.save();

    if(registeredAdmin) {
        req.flash("success", "Registered the admin successfully");
        res.redirect("/superadmin/dashboard/librarian-form");
        sendEmail(email, `You are now an admin of ${dept} Department`);
    } 
};








// module.exports.registerAdmin = async (req, res) => {
//     const { email, username, password, dept } = req.body;
//     const admin = new Admin({ email, username, dept });
//     const registeredAdmin = await Admin.register(admin, password);
//     if (registeredAdmin) {
//       sendEmail(email, `You are now an admin of ${dept} Department`);
//     }
//     req.flash("success", "Welcome to bookstream");
//     res.redirect("/");
//   };



// method used to register a superadmin used only one time to register one and only one bhagwaan of this app.. 
// superadmin has the rights to register admins 


// module.exports.registerSuperadmin = async (req,res)=>{
//     const username = "demo user";
//     const password = "demohello";
//     const collegeid = 3333;
//     const superAdmin = await Superadmin.findOne({collegeid: collegeid, username: username});
//     if(superAdmin) {
//        return res.send("SuperAdmin already exists");
//     } 
//     const newUser = new Superadmin({collegeid, username});
//     await newUser.setPassword(password);
//     await newUser.save();

//     if(newUser) {
//         console.log("hogaya bhai");
//         res.send("done!");
//     } else {
//         res.send("Some error occurred!");
//     }
// };



// const registerSuperadmin = async (collegeid, username, password) => {
//     try {
//       // Check if username already exists in the database
//       const existingUser = await SuperAdmin.findOne({ username });
//       if (existingUser) {
//         throw new Error('Username already exists');
//       }
  
//       // Create a new user document
//       const newUser = new SuperAdmin({ collegeid, username });
//       await newUser.setPassword(password);
//       await newUser.save();
  
//       return newUser;
//     } catch (error) {
//       throw error;
//     }
//   };