const {
  selectCategories,
  selectReviews,
  selectReviewByID,
  selectCommentsByReviewID,
} = require("../models/model");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewByID = (req, res, next) => {
  const ID = req.params.review_id;

  selectReviewByID(ID)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReviewID = (req, res, next) => {
  const ID = req.params.review_id;

  selectCommentsByReviewID(ID)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};