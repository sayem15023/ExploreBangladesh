const Review = require('./../model/review');
const AppError = require('./../utility/appError');
const asyncHandler = require('./../utility/asyncHandler');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next()
};

exports.getAllReviews = asyncHandler(async (req, res, next) => {
  let filter = { tour: req.params.tour };
  req.query={sort: '-rating', limit:5}

  const features = new APIFeatures(Review.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const reviews = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.getReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  
  if (!review) {
    return next(new AppError('No reviews found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

exports.createReview = asyncHandler(async (req, res, next) => {
  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review
    }
  });
});


exports.updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});


exports.deleteReview = asyncHandler(async (req, res, next) => {
  const reviews = await Review.findByIdAndDelete(req.params.id);

  if (!reviews) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
