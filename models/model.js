const db = require("../db/connection");

exports.selectCategories = (req, res) => {
  return db.query("SELECT * FROM categories;").then(({ rows }) => {
    return rows;
  });
};

exports.selectReviews = (req, res) => {
  return db
    .query(
      `
        SELECT reviews.review_id,
        reviews.title,
        reviews.designer,
        reviews.owner,
        reviews.review_img_url,
        reviews.category,
        reviews.created_at,
        reviews.votes, 

        COUNT(comments.review_id) AS comment_count

        FROM comments RIGHT JOIN reviews
        ON comments.review_id = reviews.review_id
        GROUP BY reviews.review_id
        ORDER BY reviews.created_at DESC;
     `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectReviewByID = (ID) => {
  if (Number(ID) === NaN) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `
    SELECT * FROM reviews WHERE review_id = $1;`,
      [ID]
    )

    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, message: "Path not found" });
      else return rows[0];
    });
};

exports.selectCommentsByReviewID = (ID) => {
  return db
    .query(
      `SELECT * FROM comments where review_id = $1 ORDER BY created_at DESC;`,
      [ID]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentByReviewID = (newBody, reviewID) => {
  const { username, body } = newBody;

  if (
    !Boolean(body) ||
    !Boolean(username) ||
    typeof username !== "string" ||
    typeof body !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `INSERT INTO comments 
  (body, votes, author, review_id) 
  VALUES ($1, $2, $3, $4) RETURNING *;`,
      [body, 0, username, reviewID]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateReviewByID = (update, ID) => {
  const { inc_votes } = update;
  return db
    .query(
      `UPDATE reviews
      SET votes = votes + $1
      WHERE review_id = $2
      RETURNING *`,
      [inc_votes, ID]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "ID not found" });
      else return rows[0];
    });
};
