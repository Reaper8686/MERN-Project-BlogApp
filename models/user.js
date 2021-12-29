const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");
const crypto = require("crypto");

let UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
      unique: true,
    },
    userinfo: {
      type: String,
      trim: true,
    },
    salt: String,
    encrypt_password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {timestamps: true}
);

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.encrypt_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
  authentication: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encrypt_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("user", UserSchema);
