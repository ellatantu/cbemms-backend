const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const noteSchema = new mongoose.Schema({
  Checked_By: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  Branch_Name: {
    type: String,
    required: true,
  },
  Item_Type: {
    type: String,
    required: true,
  },
  Model: {
    type: String,
    required: true,
  },
  Serial_Number: {
    type: String,
    required: true,
  },
  Problem: {
    type: String,
    required: false,
  },
  Required_Equipments: {
    type: String,
    required: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  Mantained_By: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "User",
  },
  Assigned_To: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "User",
  },
});

module.exports = mongoose.model("Note", noteSchema);
