const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WaitingListSchema = new Schema({
    collegeid: {
        type: Number,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: "Books"
    }
});

const WaitingList = mongoose.model("WaitingList",WaitingListSchema);
module.exports = WaitingList;