const Superadmin = require("../models/superadmin");
const Admin = require("../models/admin");
const sendEmail = require("../nodemailer");
const User = require("../models/users");

module.exports.login = (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = req.session.returnTo || "/superadmin/dashboard";
    delete req.session.returnTo;
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
    const admin = new Admin({ email, username, dept, phone, collegeid });
    const registeredAdmin = await Admin.register(admin, password);
    if(registeredAdmin) {
        sendEmail(email, `You are now an admin of ${dept} Department`);
    }
    req.flash("success", "Welcome to bookstream");
    res.redirect("/");
}








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
//     const username = "Aryan Singh";
//     const password = "aryanhello";
//     const superAdmin = new Superadmin({ username });
//     const registerSuperadmin = await Superadmin.register(superAdmin, password);
//     if(registerSuperadmin) {
//         console.log("hogaya bhai");
//     }
// }



