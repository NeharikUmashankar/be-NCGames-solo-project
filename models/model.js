const e = require("express");
const db = require("../db/connection");

exports.selectCategories = (req, res) => {
  return db.query("SELECT * FROM categories;").then(({ rows }) => {
    return rows;
  });
};

exports.selectUsers = (req, res) => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.selectReviews = (query = undefined) => {
  return db
    .query("SELECT category FROM reviews;")
    .then(({ rows }) => {
      const categorySet = [];

      rows.forEach((element) => categorySet.push(element.category));

      let categorySort = ``;
      let chosenOrder = "DESC";
      let sort = `reviews.created_at `;

      if (Object.keys(query).includes("category")) {
        categorySort = `WHERE reviews.category = '${query.category}'`;
      }

      if (Object.keys(query).includes("sort_by")) {
        sort = `reviews.${query.sort_by} `;
      }

      if (Object.keys(query).includes("order")) {
        chosenOrder = `${query.order}`;
      }

      if (
        !["ASC", "DESC"].includes(chosenOrder.toUpperCase()) ||
        ![...new Set(categorySet), undefined].includes(query.category) ||
        ![
          "reviews.owner ",
          "reviews.title ",
          "reviews.review_id ",
          "reviews.category ",
          "reviews.review_img_url ",
          "reviews.created_at ",
          "reviews.votes ",
          "reviews.designer ",
          "reviews.comment_count ",
        ].includes(sort)
      ) {
        return Promise.reject({ status: 404, msg: "Input not found" });
      }

      const queryStatement =
        ` SELECT reviews.review_id,
    reviews.title,
    reviews.designer,
    reviews.owner,
    reviews.review_img_url,
    reviews.category,
    reviews.created_at,
    reviews.votes, 

    COUNT(comments.review_id) AS comment_count

    FROM comments RIGHT JOIN reviews
    ON comments.review_id = reviews.review_id ` +
        categorySort +
        ` GROUP BY reviews.review_id
    ORDER BY ${sort} ${chosenOrder};`;

      return db.query(queryStatement);
    })

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
