const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const mongoSanitizer = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const path = require("path");
const cookieParser = require("cookie-parser");

const AppError = require("./utility/appError");
const errorController = require("./controller/errorController");
const tourRouter = require("./route/tourRouter");
const userRouter = require("./route/userRouter");
const reviewRouter = require("./route/reviewRouter");
const viewRouter = require("./route/viewRouter");
const touristSpotRouter = require("./route/touristSpotRouter");
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

//Databse connection
mongoose
  .connect(process.env.DATABASE, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((connecton) => {
    console.log(`db is connected`);
  });

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "view"));

app.use(express.static(path.join(__dirname, "public")));

//Middleware
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many request. Please try again after some time",
});

app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitizer());
app.use(xssClean());
app.use(
  hpp({
    whitelist: ["duration", "price", "difficulty"],
  })
);

app.use(morgan("dev"));
//route

app.use("/api/v1/touristSpot", touristSpotRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/", viewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on the server`, 400));
});

app.use(errorController);

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message, err.stack);
  process.exit();
});
