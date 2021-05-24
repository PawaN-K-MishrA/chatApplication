const mongoose = require("mongoose"),
  { Schema } = require("mongoose");

  const message=new Schema({
    date:Date,
    mssg:String
  })
const messageSchema = new Schema({
  content: [message],
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
