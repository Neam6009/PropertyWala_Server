const request = require("supertest");
const { app } = require("../server");
const userModel = require("../models/user_model");
const bcrypt = require("bcryptjs");

describe("User Controller Tests", () => {
  describe("POST /login", () => {
    test("should log in an existing user with correct credentials", async () => {
      // Mocking request body
      const requestBody = {
        email: "testuser@example.com",
        password: "TestPassword123",
      };

      // Mocking the behavior of userModel.User.findOne() method
      userModel.User.findOne = jest.fn().mockResolvedValue({
        _id: "user_id",
        name: "Test User",
        email: "testuser@example.com",
        password: "hashedPassword",
      });

      // Mocking the behavior of bcrypt.compare() method
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      // Making the request to the /login route
      const response = await request(app).post("/auth/login").send(requestBody);

      // Asserting the response status code
      expect(response.status).toBe(200);

      // Asserting the response body
      expect(response.body).toEqual({
        user: {
          _id: "user_id",
          name: "Test User",
          email: "testuser@example.com",
          password: "hashedPassword",
        },
      });
    });

    test("should return an error for incorrect password", async () => {
      // Mocking request body
      const requestBody = {
        email: "testuser@example.com",
        password: "WrongPassword123",
      };

      // Mocking the behavior of userModel.User.findOne() method
      userModel.User.findOne = jest.fn().mockResolvedValue({
        _id: "user_id",
        name: "Test User",
        email: "testuser@example.com",
        password: "hashedPassword",
      });

      // Mocking the behavior of bcrypt.compare() method
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      // Making the request to the /login route
      const response = await request(app).post("/auth/login").send(requestBody);

      // Asserting the response status code
      expect(response.status).toBe(200);

      // Asserting the response body
      expect(response.body).toEqual({
        error: "Incorrect password!",
      });
    });

    test("should return an error for unregistered email", async () => {
      // Mocking request body
      const requestBody = {
        email: "unregistered@example.com",
        password: "TestPassword123",
      };

      // Mocking the behavior of userModel.User.findOne() method
      userModel.User.findOne = jest.fn().mockResolvedValue(null);

      // Making the request to the /login route
      const response = await request(app).post("/auth/login").send(requestBody);

      // Asserting the response status code
      expect(response.status).toBe(200);

      // Asserting the response body
      expect(response.body).toEqual({
        error: "Email not registered, register first",
      });
    });
  });
});
