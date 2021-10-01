const Tour = require("./../model/tour");
const User = require("./../model/user");
const TouristSpot = require("./../model/touristSpot");

const asyncHandler = require("./../utility/asyncHandler");

exports.getOverview = (req, res) => {
  res.status(200).render("overview", {
    title: "Overview",
  });
};

exports.getTours = asyncHandler(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render("tours", {
    title: "All Tours",
    page: "tours",
    tours: tours,
  });
});

exports.getTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    select: "review rating user",
  });
  if (!tour) {
    return next();
  }
  console.log(tour);
  res.status(200).render("tour", {
    title: tour.name,
    tour,
  });
});
exports.getTouristSpot = asyncHandler(async (req, res, next) => {
  const touristSpot = await TouristSpot.findById(req.params.id);
  if (!touristSpot) {
    return next();
  }
  res.status(200).render("touristSpot", {
    title: touristSpot.name,
    touristSpot,
  });
});

exports.getLogin = (req, res) => {
  res.status(200).render("login", {
    title: "Log in",
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "My Account",
  });
};

exports.getExplore = (req, res) => {
  res.status(200).render("explore", {
    title: "Explore Bangladesh",
  });
};

exports.updateUserData = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render("account", {
    title: "My Account",
    user: updatedUser,
  });
});

exports.getSignup = (req, res) => {
  res.status(200).render("signup", {
    title: "Sign Up",
  });
};

exports.getFind = (req, res) => {
  res.status(200).render("find", {
    title: "Find",
  });
};

exports.bookTour = (req, res) => {
  res.status(200).render("form", {
    title: "Book Your Tour",
  });
};
