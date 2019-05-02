var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var uniqueValidator = require("mongoose-unique-validator");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var secret = require("../config").secret;

var FBUserSchema = new mongoose.Schema(
  {
    fbId: {
      type: Number,
      unique: true,
      index: true
    },
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9_ ]+$/, "is invalid"]
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    hash: String,
    salt: String
    // configurations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Configuration' }]
  },
  { timestamps: true }
);

FBUserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

FBUserSchema.methods.validPassword = function(password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

FBUserSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  );
};

FBUserSchema.methods.toAuthJSON = function() {
  return {
    fbId: this.fbId,
    username: this.username,
    email: this.email,
    token: this.generateJWT()
  };
};

FBUserSchema.plugin(uniqueValidator, { message: "is already taken." });
FBUserSchema.plugin(mongoosePaginate);
mongoose.model("FBUser", FBUserSchema);
