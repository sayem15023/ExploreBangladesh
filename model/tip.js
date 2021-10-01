const mongoose = require("mongoose");

const tipSchema = new mongoose.Schema(
  {
    tip: {
      type: String,
      required: [true, "A tips must have a description!"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    touristSpot: {
      type: mongoose.Schema.ObjectId,
      ref: "TouristSpot",
      required: [true, "tips must belong to a tourist spot."],
    },
    userName: String,
    userPhoto: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Tip = mongoose.model("Tip", tipSchema);

module.exports = Tip;
