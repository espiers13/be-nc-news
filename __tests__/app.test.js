const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app/server");
const endPoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("status 200: respond with array of all topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body));
        expect(body.length).toBeGreaterThan(0);
        body.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("GET /api", () => {
  test("status 200: serves up a json representation of all the available endpoints of the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toMatchObject(endPoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status 200: responds with an article object by its id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("author");
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("article_id");
        expect(body.article).toHaveProperty("body");
        expect(body.article).toHaveProperty("topic");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("votes");
        expect(body.article).toHaveProperty("article_img_url");
      });
  });
  test("ERROR 404: sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("ERROR 400: sends an appropriate status and error message when given an id in an invaild format", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("status 200: responds with an array of all article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body));
        expect(body.length).toBeGreaterThan(0);
        body.forEach((article) => {
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("status 200: returned article objects do not have a body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBeGreaterThan(0);
        body.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("status 200: returned articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status 200: responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body));
        expect(body.length).toBeGreaterThan(0);
        expect(body).toBeSortedBy("created_at", { descending: true });
        body.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test("ERROR 404: sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("ERROR 400: sends an appropriate status and error message when given an id in an invaild format", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("status 200: sends appropriate status and an empty array when given  a valid article_id but the article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(0);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status 201: posts a new comment to an article by article_id and responds with posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "this is a good comment",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty("body");
        expect(body).toHaveProperty("votes");
        expect(body).toHaveProperty("author");
        expect(body).toHaveProperty("article_id");
        expect(body).toHaveProperty("created_at");
        expect(body.author).toBe("butter_bridge");
        expect(body.body).toBe("this is a good comment");
        expect(body.article_id).toBe(1);
      });
  });
  test("ERROR 404 - responds with an appropriate status and error message when provided with a valid but non-existent article_id", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({
        username: "betty123",
        body: "meow",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          'Key (article_id)=(999) is not present in table "articles".'
        );
      });
  });
  test("ERROR 400 - responds with an appropriate status and error message when provided with an article_id in an invalid format", () => {
    return request(app)
      .post("/api/articles/not-an-id/comments")
      .send({
        username: "betty123",
        body: "meow",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("ERROR 400 - responds with an appropriate status and error message when provided with a bad comment (no username)", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "meow",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("status 201: posts a new comment ignoring unnecessary properties in post object", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "this is a good comment",
        created_at: 12345678,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.created_at).not.toBe(12345678);
      });
  });
  test("ERROR 404 - responds with an appropriate status and error message when username is given but does not exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "betty",
        body: "this is a good comment",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          'Key (author)=(betty) is not present in table "users".'
        );
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status 200: updates an articles votes in the database given an article id", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 3,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article_id).toBe(1);
        expect(body.votes).toBe(103);
      });
  });
  test("status 404: sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({
        inc_votes: 1,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("status 404: sends an appropriate status and error message when given a non-valid body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: "invalid votes",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status 204: deletes comment when given a valid comment id", () => {
    return request(app).delete("/api/comments/4").expect(204);
  });
  test("ERROR 404: responds with an appropriate status and error message when given a non-existen id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
  test("ERROR 400: responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/not-a-comment")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("status 200: responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users));
        expect(body.users.length).toBeGreaterThan(0);
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  describe("sort_by - responds with an array of article objects sorted by any valid column (default order: descending)", () => {
    test("status 200: sort_by: title", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("title", { descending: true });
        });
    });
    test("status 200: sort_by: topic", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("topic", { descending: true });
        });
    });
    test("ERROR 400: responds with appropriate status and error message when given an invalid search criteria", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid-criteria")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
  describe("order - responds with an array of article objects sorted either asc or desc", () => {
    test("status 200: order: asc", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("created_at", { descending: false });
        });
    });
    test("status 200: order: asc, sort_by: votes", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("votes", { descending: false });
        });
    });
    test("status 200: defaults to descending order when invalid order request is given", () => {
      return request(app)
        .get("/api/articles?order=invalid-order")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("status 200: responds with an array of articles filtered by the given topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBeGreaterThan(0);
        body.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("ERROR 404: sends an appropriate status and error message when given an invalid topic", () => {
    return request(app)
      .get("/api/articles?topic=invalid-topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("topic does not exist");
      });
  });
  test("status 200: responds with an empty array when passed a valid topic with no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });
});

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("status 200: responds with article object which contains comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("comment_count");
        expect(body.article.article_id).toBe(1);
        expect(body.article.comment_count).toBe("11");
      });
  });
});

// describe("Express Routers", () => {
//   test("connects to apiRouter", () => {
//     return request(app).get("/api").expect(200);
//   });
// });
