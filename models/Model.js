var mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
var uniqueValidator = require("mongoose-unique-validator");

var ModelSchema = new mongoose.Schema(
  {
    internalId: {
      type: Number,
      unique: true,
      required: [true, "can't be blank"],
      index: true
    },
    value: { type: Number, required: [true, "can't be blank"] },
    totalRates: { type: Number },
    configuration: { type: Schema.Types.ObjectId, ref: "Configuration" }
  },
  { timestamps: true }
);

ModelSchema.methods.toAuthJSON = function() {
  return {
    internalId: this.internalId,
    value: this.value,
    configuration: this.configuration
  };
};

ModelSchema.plugin(uniqueValidator, { message: "is already taken." });
ModelSchema.plugin(mongoosePaginate);
mongoose.model("Model", ModelSchema);
