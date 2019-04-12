var mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
var uniqueValidator = require("mongoose-unique-validator");

var ConfigSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true
    },
    minRate: { type: Number, required: [true, "can't be blank"] },
    maxRate: { type: Number, required: [true, "can't be blank"] }
  },
  { timestamps: true }
);

ConfigSchema.methods.toAuthJSON = function() {
  return {
    name: this.name,
    minRate: this.minRate,
    maxRate: this.maxRate
  };
};

ConfigSchema.plugin(uniqueValidator, { message: "is already taken." });
ConfigSchema.plugin(mongoosePaginate);
mongoose.model("Configuration", ConfigSchema);
