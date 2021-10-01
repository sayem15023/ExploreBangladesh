const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../model/user");
const asyncHandler = require("./../utility/asyncHandler");
const AppError = require("./../utility/appError");
const sendEmail = require("./../utility/emailUtility");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;
  console.log(user);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = asyncHandler(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(newUser, 201, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Please provide valid credential", 400));
  }

  const correct = await user.confirmPassword(password, user.password);
  if (!correct) {
    return next(new AppError("Please provide valid credential", 401));
  }

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.authenticate = asyncHandler(async (req, res, next) => {
  // Getting the auth token and check if it's there
  let token;
  if (
    req.header.authorization &&
    req.header.authorization.startsWith("Bearer")
  ) {
    token = req.header.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("Please log in to get access", 401));
  }
  // Verify Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //Check if user exist
  const returnedUser = await User.findById(decoded.id);
  if (!returnedUser) {
    return next(new AppError("The user no longer exist", 401));
  }

  //Check if user changed password after the token was issued

  if (returnedUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password. Please log in again", 401)
    );
  }
  res.locals.user = returnedUser;
  req.user = returnedUser;
  next();
});

exports.isLoggedIn = asyncHandler(async (req, res, next) => {
  // Getting the auth token and check if it's there
  let token;
  if (req.cookies.jwt) {
    try {
      token = req.cookies.jwt;

      // Verify Token
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      //Check if user exist
      const returnedUser = await User.findById(decoded.id);
      if (!returnedUser) {
        return next();
      }

      //Check if user changed password after the token was issued

      if (returnedUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      res.locals.user = returnedUser;
      return next();
    } catch (error) {
      return next();
    }
  }
  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Not authorized to perform the action", 403));
    }
    next();
  };
};

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //check if user exist based on given email
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new AppError("User does not exist", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({
    validateBeforeSave: false,
  });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/${resetToken}`;
  const message = `if you didn't send this request, please ignore this. Forgot your password? Set your new password to ${resetURL}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset!! valid for 10 minutes",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Password reset token is sent to email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("Error sending the mail. Please try again", 500));
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get User based on given token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token is invalid or expires", 400));
  }
  // if a valid user exists based on the token then save the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  // log in with the new password
  createSendToken(user, 200, res);
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  //find info of user
  console.log(req.body);
  const user = await User.findById(req.user.id).select("+password");
  console.log(user);
  const tf = await user.confirmPassword(
    req.body.passwordCurrent,
    user.password
  );
  console.log(tf);
  //compare given password with the password stored in database
  if (!tf) {
    return next(new AppError("Your password is wrong", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, res);
});
