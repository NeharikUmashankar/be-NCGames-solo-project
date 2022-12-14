const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewByID,
  getCommentByReviewID
} = require("./controllers/controller");
const {
  handle404s,
  handle500s,
  handle400s,
  handleBadPath,
} = require("./PathAndErrorHandlers/errorHandles");

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewByID);
app.get("/api/reviews/:review_id/comments", getCommentByReviewID);
app.use("/*", handleBadPath); //Bad paths

//Error handling

app.use(handle400s);
app.use(handle404s);
app.use(handle500s);

module.exports = app;
