const express = require("express");
const viewController = require("./../controller/viewController");
const authController = require("./../controller/authController");
const router = express.Router();

router.get("/", authController.isLoggedIn, viewController.getOverview);
router.get("/tours", authController.isLoggedIn, viewController.getTours);
router.get("/tour/:slug", authController.isLoggedIn, viewController.getTour);
router.get("/explore", authController.isLoggedIn, viewController.getExplore);
router.get(
  "/explore/:id",
  authController.isLoggedIn,
  viewController.getTouristSpot
);
router.get("/login", viewController.getLogin);
router.get("/signup", viewController.getSignup);
router.get("/me", authController.authenticate, viewController.getAccount);
router.post(
  "/submit-user-data",
  authController.authenticate,
  viewController.updateUserData
);
router.get("/find", authController.authenticate, viewController.getFind);
router.get("/book", authController.isLoggedIn, viewController.bookTour);
module.exports = router;
