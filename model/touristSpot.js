const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const touristSpotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tourist spot must have a name"],
      unique: true,
      trim: true,
      maxlength: 40,
      minlength: 8,
    },
    type: {
      type: String,
      required: [true, "A tour must have a type"],
      enum: {
        values: [
          "Historical",
          "Forest",
          "Hill",
          "Sea-beach",
          "Waterfall",
          "Island",
          "Museum",
          "Park",
          "Reacreation",
          "Zoo",
          "Others",
        ],
        message: "This type is not allowed",
      },
    },
    slug: String,
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
      minlength: 60,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    imageCover: {
      type: String,
      required: [true, "A tour must a have cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    direction: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    todo: {
      type: String,
      required: [true, "A tour must have a district"],
    },
    district: {
      type: String,
      required: [true, "A tour must have a district"],
    },
    locations: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

touristSpotSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const TouristSpot = mongoose.model("TouristSpot", touristSpotSchema);

module.exports = TouristSpot;
