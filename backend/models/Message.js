const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  id: Number,
  user: String,
  room: String,
  text: String,
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);