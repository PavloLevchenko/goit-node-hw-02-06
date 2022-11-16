require("dotenv").config();
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

beforeAll(async () => {
  await mongoose.connect(process.env.DB_TEST_HOST).catch((err) => {
    console.log(`Database connection error: ${err.message}`);
    process.exit(1);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/users/login", function () {
  test("Should return response status code 200 with token and user with string fields email and subscription", (done) => {
    const payload = {
      email: "example@example.com",
      password: "Examplepassword1",
    };
    request(app)
      .post("/api/users/login")
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).toEqual(
          expect.objectContaining({
            token: expect.any(String),
            user: expect.objectContaining({
              email: expect.any(String),
              subscription: expect.any(String),
            }),
          })
        );
        return done();
      });
  });
});
