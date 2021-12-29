const mongoose = require("mongoose");

let CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
      unique: true,
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model("category", CategorySchema);
