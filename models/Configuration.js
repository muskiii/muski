var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var uniqueValidator = require("mongoose-unique-validator");

var ConfigSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      // unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      // index: true
    },
    untilRank: { type: Number, required: [true, "can't be blank"] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

ConfigSchema.methods.toAuthJSON = function() {
  return {
    name: this.name,
    untilRank: this.untilRank
  };
};

ConfigSchema.plugin(uniqueValidator, { message: "is already taken." });
ConfigSchema.plugin(mongoosePaginate);
mongoose.model("Configuration", ConfigSchema);
