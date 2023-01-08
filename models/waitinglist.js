const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WaitingListSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: "Books"
    }
});

const WaitingList = mongoose.model("WaitingList",WaitingListSchema);
module.exports = WaitingList;