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
    rate: { type: Number, min: 0 },
    rates: { type: Map, of: Number },
    totalRates: { type: Number },
    comments: [String],
    configuration: { type: Schema.Types.ObjectId, ref: "Configuration" }
  }
);

ModelSchema.methods.toDTO = function() {
  return {
    internalId: this.internalId,
    rate: this.rate,
    totalRates: this.totalRates,
    comments: this.comments,
    rates: this.rates
  };
};

ModelSchema.methods.calculateRate = function() {
  let p = 0;
  let t = 0;
  // let scale = this.rates.size;
  // const Q = 10;
  this.rates.forEach(function(value, key, map) {
    p += parseInt(key, 10) * value;
    t += value;
  });
  // score = p / scale + scale * (1 - Math.E ** ((-this.totalRates) / Q));
  this.rate = p/t;
};
ModelSchema.methods.addNewRate = function(value) {
  let targetRate = Math.round(value).toString();
  this.rates.set(targetRate, this.rates.get(targetRate) + 1); //sin no funca meter self
  this.totalRates++;
};

ModelSchema.plugin(uniqueValidator, { message: "is already taken." });
ModelSchema.plugin(mongoosePaginate);
mongoose.model("Entity", ModelSchema);
