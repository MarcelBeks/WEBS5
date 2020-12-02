const mongoose = require("mongoose");

const RaceSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  waypoints: { type: Object, required: true },
  created_by: { type: Object, required: true, ref: 'User' },
  started: { type: Boolean, default: false },
});

module.exports = mongoose.model("Race", RaceSchema);