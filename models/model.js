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
  return db
    .query(
      `
    SELECT * FROM reviews WHERE review_id = $1;`,
      [ID]
    )

    .then(({ rows }) => {
      if (rows.length !== 0) return rows[0];

      else return Promise.reject({status: 404, message: 'Path not found'})
    });
};
