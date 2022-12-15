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
      .get("/api/reviews ")
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
