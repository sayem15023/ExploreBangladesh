const Tip = require("./../model/tip");
const AppError = require("./../utility/appError");
const asyncHandler = require("./../utility/asyncHandler");
const TouristSpot = require("./../model/touristSpot");
//GET /api/v1/coachingCenterId/:coachingCenterId/courses

exports.getAllTips = asyncHandler(async (req, res, next) => {
  const tips = await Tip.find({ touristSpot: req.params.id });
  res.status(200).json({
    status: "success",
    result: tips.length,
    data: {
      tips,
    },
  });
});

exports.createTip = asyncHandler(async (req, res, next) => {
  // const touristSpot = await TouristSpot.findById(req.params.id);
  console.log(req.user);
  req.body.touristSpot = req.params.id;
  req.body.userName = req.user.name;
  req.body.userPhoto = req.user.photo;

  const newTip = await Tip.create(req.body);
  res.status(201).json({
    status: "success",
    Data: {
      tour: newTip,
    },
  });
});
