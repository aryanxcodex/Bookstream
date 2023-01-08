const mongoose = require("mongoose");
const Schema = mongoose.Schema;




const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  ISBN: {
    type: Number,
    required: true,
  },
  authors: {
    required: true,
    type: [String]
  },
  category: {
    required: true,
    type: [String]
  },
  stock: {
    type: Number,
    default: 1
  }, 
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

const Books = mongoose.model("Books", BookSchema);
module.exports = Books;
