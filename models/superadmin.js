const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");

const SuperadminSchema = new Schema({
    collegeid: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
    }
});

SuperadminSchema.plugin(passportLocalMongoose, {usernameUnique: false});

module.exports = mongoose.model("SuperAdmin", SuperadminSchema);




