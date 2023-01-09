const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
beforeEach(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe("GET api/:path", () => {
  test("status 200: responds with an array of objects with properties of slug and description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);

        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });

  test("status 200: responds with an array of objects with required properties", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("created_at", { descending: true });

        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET api/reviews/:review_id,", () => {
  test("Responds with a single review as per specified ID", () => {
    const ID = 6;
    return request(app)
      .get(`/api/reviews/${ID}`)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;

        expect(review).toEqual({
          review_id: 6,
          title: "Occaecat consequat officia in quis commodo.",
          designer: "Ollie Tabooger",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          review_body:
            "Fugiat fugiat enim officia laborum quis. Aliquip laboris non nulla nostrud magna exercitation in ullamco aute laborum cillum nisi sint. Culpa excepteur aute cillum minim magna fugiat culpa adipisicing eiusmod laborum ipsum fugiat quis. Mollit consectetur amet sunt ex amet tempor magna consequat dolore cillum adipisicing. Proident est sunt amet ipsum magna proident fugiat deserunt mollit officia magna ea pariatur. Ullamco proident in nostrud pariatur. Minim consequat pariatur id pariatur adipisicing.",
          category: "social deduction",
          created_at: "2020-09-13T14:19:28.077Z",
          votes: 8,
        });
      });
  });

  test("Error 400: invalid ID/bad request", () => {
    return request(app)
      .get("/api/reviews/bruh")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("Error 404: Path/ID not found", () => {
    return request(app)
      .get("/api/reviews/576475645476574")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
});

describe("GET /api/users", () => {
  test("status 200: responds with an array of objects with users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);

        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("POST get/api/reviews/:review_id/comments", () => {
  test("status 201: Inserts the request body in comment format", () => {
    const newComment = {
      username: "mallionaire",
      body: "I like ice cream",
    };

    return request(app)
      .post("/api/reviews/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { newComment } = body;

        expect(newComment).toEqual(
          expect.objectContaining({
            comment_id: 7,
            body: "I like ice cream",
            author: "mallionaire",
            review_id: 3,
            created_at: expect.any(String),
          })
        );
      });
  });

  test("status 201: Inserts commend body while ignoring redundant keys", () => {
    const newComment = {
      username: "mallionaire",
      body: "I like ice cream",
      randomKey: "Of no relevance whatsoever",
    };

    return request(app)
      .post("/api/reviews/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { newComment } = body;

        expect(newComment).toEqual(
          expect.objectContaining({
            comment_id: 7,
            body: "I like ice cream",
            author: "mallionaire",
            review_id: 3,
            created_at: expect.any(String),
          })
        );
      });
  });

  test("404: Nonexistent username", () => {
    const newComment = {
      username: "hrtjrhtjrgjtr",
      body: "I like ice cream",
    };

    return request(app)
      .post("/api/reviews/3/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Entry not found");
      });
  });

  test("Error 400: Bad path/request", () => {
    const newComment = {
      username: "mallionaire",
      body: "I like ice cream",
    };

    return request(app)
      .post("/api/reviews/bruh/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });

  test("Error 404: ID not found", () => {
    const newComment = {
      username: "mallionaire",
      body: "I like ice cream",
    };

    return request(app)
      .post("/api/reviews/433343434/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Entry not found");
      });
  });

  test("Error 400: Bad request body", () => {
    const newComment = {
      username: "mallionaire",
      body: 65,
    };

    return request(app)
      .post("/api/reviews/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });

  test("Error 400: Missing elements in request body", () => {
    const newComment = {};

    return request(app)
      .post("/api/reviews/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("status:200, responds with the updated review", () => {
    const reviewUpdate = { inc_votes: 23 };
    return request(app)
      .patch("/api/reviews/7")
      .send(reviewUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedReview).toEqual({
          review_id: 7,
          title: "Mollit elit qui incididunt veniam occaecat cupidatat",
          category: "social deduction",
          designer: "Avery Wunzboogerz",
          owner: "mallionaire",
          review_body:
            "Consectetur incididunt aliquip sunt officia. Magna ex nulla consectetur laboris incididunt ea non qui. Enim id eiusmod irure dolor ipsum in tempor consequat amet ullamco. Occaecat fugiat sint fugiat mollit consequat pariatur consequat non exercitation dolore. Labore occaecat in magna commodo anim enim eiusmod eu pariatur ad duis magna. Voluptate ad et dolore ullamco anim sunt do. Qui exercitation tempor in in minim ullamco fugiat ipsum. Duis irure voluptate cupidatat do id mollit veniam culpa. Velit deserunt exercitation amet laborum nostrud dolore in occaecat minim amet nostrud sunt in. Veniam ut aliqua incididunt commodo sint in anim duis id commodo voluptate sit quis.",
          review_img_url:
            "https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          created_at: "2021-01-25T11:16:54.963Z",
          votes: 32,
        });
      });
  });

  test("status:200, responds with the updated review when vote increment is negative", () => {
    const reviewUpdate = { inc_votes: -23 };
    return request(app)
      .patch("/api/reviews/7")
      .send(reviewUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedReview).toEqual({
          review_id: 7,
          title: "Mollit elit qui incididunt veniam occaecat cupidatat",
          category: "social deduction",
          designer: "Avery Wunzboogerz",
          owner: "mallionaire",
          review_body:
            "Consectetur incididunt aliquip sunt officia. Magna ex nulla consectetur laboris incididunt ea non qui. Enim id eiusmod irure dolor ipsum in tempor consequat amet ullamco. Occaecat fugiat sint fugiat mollit consequat pariatur consequat non exercitation dolore. Labore occaecat in magna commodo anim enim eiusmod eu pariatur ad duis magna. Voluptate ad et dolore ullamco anim sunt do. Qui exercitation tempor in in minim ullamco fugiat ipsum. Duis irure voluptate cupidatat do id mollit veniam culpa. Velit deserunt exercitation amet laborum nostrud dolore in occaecat minim amet nostrud sunt in. Veniam ut aliqua incididunt commodo sint in anim duis id commodo voluptate sit quis.",
          review_img_url:
            "https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          created_at: "2021-01-25T11:16:54.963Z",
          votes: -14,
        });
      });
  });

  test("status:200, responds with the updated review so long as the needed key is present", () => {
    const reviewUpdate = { inc_votes: 23, randomKey: "545454" };
    return request(app)
      .patch("/api/reviews/7")
      .send(reviewUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedReview).toEqual({
          review_id: 7,
          title: "Mollit elit qui incididunt veniam occaecat cupidatat",
          category: "social deduction",
          designer: "Avery Wunzboogerz",
          owner: "mallionaire",
          review_body:
            "Consectetur incididunt aliquip sunt officia. Magna ex nulla consectetur laboris incididunt ea non qui. Enim id eiusmod irure dolor ipsum in tempor consequat amet ullamco. Occaecat fugiat sint fugiat mollit consequat pariatur consequat non exercitation dolore. Labore occaecat in magna commodo anim enim eiusmod eu pariatur ad duis magna. Voluptate ad et dolore ullamco anim sunt do. Qui exercitation tempor in in minim ullamco fugiat ipsum. Duis irure voluptate cupidatat do id mollit veniam culpa. Velit deserunt exercitation amet laborum nostrud dolore in occaecat minim amet nostrud sunt in. Veniam ut aliqua incididunt commodo sint in anim duis id commodo voluptate sit quis.",
          review_img_url:
            "https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          created_at: "2021-01-25T11:16:54.963Z",
          votes: 32,
        });
      });
  });

  test("status:404: ID valid but not found", () => {
    const reviewUpdate = { inc_votes: 23 };
    return request(app)
      .patch("/api/reviews/446565565")
      .send(reviewUpdate)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("ID not found");
      });
  });

  test("status:400: Bad request when path is invalid", () => {
    const reviewUpdate = { inc_votes: 23 };
    return request(app)
      .patch("/api/reviews/goku")
      .send(reviewUpdate)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });

  test("status:400: Bad request when body is malformed", () => {
    const reviewUpdate = { irrelevant_key: "23" };
    return request(app)
      .patch("/api/reviews/goku")
      .send(reviewUpdate)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });

  test("status:400: Bad request when body is missing", () => {
    const reviewUpdate = {};
    return request(app)
      .patch("/api/reviews/goku")
      .send(reviewUpdate)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
});

describe("ALL categories of undefined path", () => {
  test("status 404: catches error for non-existent path", () => {
    return request(app)
      .get("/api/categoriesss")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Path not found");
      });
  });
});

describe("GET api/reviews?query", () => {
  test("status 200: responds with category = social deduction", () => {
    return request(app)
      .get("/api/reviews?category=social+deduction")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(11);
        expect(reviews).toBeSortedBy("created_at", { descending: true });
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: "social deduction",
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });

  test("status 200: responds with review sorted as per input", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("review_id", { descending: true });
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });

  test.only("status 404: Input not found", () => {
    return request(app)
      .get("/api/reviews?category='iDontExist'")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Input not found");
      });
  });

  test("status 404: Input not found", () => {
    return request(app)
      .get("/api/reviews?sort_by=54")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Input not found");
      });
  });
});

describe("GET api/reviews/:review_id/comments,", () => {
  test("Responds with the comments of a specific review ID", () => {
    const ID = 3;
    return request(app)
      .get(`/api/reviews/${ID}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              review_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
            })
          );
        });

        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("Responds with an empty array if there's no comments for a given ID", () => {
    const ID = 1;
    return request(app)
      .get(`/api/reviews/${ID}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });

  test("Error 400: invalid ID/bad request", () => {
    return request(app)
      .get("/api/reviews/utterGibberish/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("Error 404: ID not found", () => {
    return request(app)
      .get("/api/reviews/4875485748/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
});
