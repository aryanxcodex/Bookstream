const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");

const AdminSchema = new Schema({
  collegeid: {
    type: Number,
    required: true,
  },
  phone:{
    type: Number,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dept: {
    type: String,
    enum: ["BMM", "BSCIT"],
    required: true,
  },
});

AdminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", AdminSchema);
