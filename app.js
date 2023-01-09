const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const {
  getCategories,
  getReviews,
  getUsers,
  getReviewByID,
  getCommentsByReviewID,
  postCommentByReviewID,
  patchReviewByID,
} = require("./controllers/controller");
const {
  handle404s,
  handle500s,
  handleErrorCodes,
  handleBadPath,
} = require("./PathAndErrorHandlers/errorHandles");

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/users", getUsers);
app.get("/api/reviews/:review_id", getReviewByID);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewID);
app.post("/api/reviews/:review_id/comments", postCommentByReviewID);
app.patch("/api/reviews/:review_id", patchReviewByID);
app.use("/*", handleBadPath); //Bad paths

//Error handling

app.use(handleErrorCodes);
app.use(handle404s);
app.use(handle500s);

module.exports = app;
