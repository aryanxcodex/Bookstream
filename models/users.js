const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    required: true,
  },
  books_borrowed: [
    {
      bookid: { type: Schema.Types.ObjectId, ref: "Books" },
      borrowedAt: {
        type: Date,
        default: Date.now,
      },
      returnAt: {
        type: Date,
        default: function () {
          let returnAt = new Date(this.borrowedAt);
          returnAt.setDate(returnAt.getDate() + 10);
          return returnAt;
        },
      },
    },
  ],
  isBlacklisted: {
    type: Boolean,
    default: false,
  },
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);


