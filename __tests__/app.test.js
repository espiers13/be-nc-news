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
  test("serves up a json representation of all the available endpoints of the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject(endPoints);
      });
  });
});
