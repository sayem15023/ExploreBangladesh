const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.authenticate);

router.route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.authorize('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router.route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.authorize('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.authorize('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;