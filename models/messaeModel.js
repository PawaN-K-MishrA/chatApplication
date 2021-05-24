const mongoose = require("mongoose"),
  { Schema } = require("mongoose");
const messageSchema = new Schema({
  content: {
    type: Object,
    default:{},
    required: [true]
  },
  userName: {
    type: String,
    required: [true]
  },
  from: {
    type: Schema.Types.ObjectId,
    required:[true]
  },
  userId: {
    type: Schema.Types.ObjectId,
    required:[true]
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
