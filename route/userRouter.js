const express = require("express");
const authController = require("./../controller/authController");
const userController = require("./../controller/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:token", authController.resetPassword);

router.use(authController.authenticate);

router.get("/me", userController.me, userController.getUser);
router.patch("/updatePassword", authController.updatePassword);
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);

// router.route('/')
//     .get(getAllUsers)
//     .post(createUser);

// router.route('/:id')
//     .get(getUser)
//     .patch(updateUser)
//     .delete(deleteUser);

module.exports = router;
