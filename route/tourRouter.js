const express = require('express');
const tourController=require('./../controller/tourController')
const authController = require('./../controller/authController');
const reviewRouter = require('./userRouter')

const router=express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/')
    .get(tourController.getAllTours)
    .post(authController.authenticate,
        authController.authorize("guide", "admin"),
        tourController.createTour)

router.route('/:id')
    .get(tourController.getTour)
    .patch(authController.authenticate,
        authController.authorize("guide", "admin"),
        tourController.updateTour)
    .delete(authController.authenticate,
        authController.authorize("guide", "admin"),
        tourController.deleteTour);

module.exports = router;