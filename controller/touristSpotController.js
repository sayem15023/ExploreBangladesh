const TouristSpot = require("./../model/touristSpot");
const AppError = require("./../utility/appError");
const asyncHandler = require("./../utility/asyncHandler");
const APIFeatures = require("./../utility/apiFeature");

exports.getAllTouristSpots = asyncHandler(async (req, res, next) => {
  const feature = new APIFeatures(TouristSpot.find(), req.query)
    .filter()
    .limitFields()
    .pagination();

  const touristSpots = await feature.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: touristSpots.length,
    data: {
      touristSpots,
    },
  });
});

exports.getTouristSpot = asyncHandler(async (req, res, next) => {
  let touristSpot = await TouristSpot.findById(req.params.id);

  if (!touristSpot) {
    return next(new AppError("No tourist spot found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      touristSpot,
    },
  });
});

exports.createTouristSpot = asyncHandler(async (req, res, next) => {
  const touristSpot = await TouristSpot.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      touristSpot,
    },
  });
});

exports.updateTouristSpot = asyncHandler(async (req, res, next) => {
  const touristSpot = await TouristSpot.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!touristSpot) {
    return next(new AppError("No tourist spot found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      touristSpot,
    },
  });
});

exports.deleteTouristSpot = asyncHandler(async (req, res, next) => {
  const touristSpot = await TouristSpot.findByIdAndDelete(req.params.id);

  if (!touristSpot) {
    return next(new AppError("No tourist spot found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// /tours-within/:distance/center/:lat/:lng
// /tours-within/233/center/34.111745/118.113491
exports.getTouristSpotsWithin = asyncHandler(async (req, res, next) => {
  const { distance, lat, lng } = req.params;

  if (!lat || !lng || !distance) {
    next(new AppError("Please provide latitude and longitude", 400));
  }
  const radius = distance / 6378.1;

  const touristSpots = await TouristSpot.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      touristSpots,
    },
  });
});
