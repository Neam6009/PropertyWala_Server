const request = require("supertest");
const { app } = require("../server");
const nodemailer = require("nodemailer");

// Import the mail controller
const mailController = require("../controllers/mailController");

describe("Mail Controller Tests", () => {
  beforeAll(() => {
    // Mock nodemailer's sendMail function
    nodemailer.createTransport = jest.fn().mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({}),
    });
  });

  describe("POST /mail/:mailId", () => {
    test("should add mail to the database and send welcome email", async () => {
      const mailId = "example@example.com";

      // Fetch CSRF token
      const csrfResponse = await request(app).get("/csrf-token");
      const csrfToken = csrfResponse.body.csrfToken;

      // Make a POST request to the endpoint with CSRF token included in headers
      const response = await request(app)
        .post(`/mail/${mailId}`)
        .set("Cookie", `csrfToken=${csrfToken}`);

      // Assert response status
      expect(response.status).toBe(200);

      // Assert that nodemailer's sendMail function was called
      expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();

      // Assert response message
      expect(response.text).toBe("");
    });
  });

  describe("POST /allMail", () => {
    test("should send mail to all users", async () => {
      // Fetch CSRF token
      const csrfResponse = await request(app).get("/csrf-token");
      const csrfToken = csrfResponse.body.csrfToken;

      // Mock the model's behavior
      mailController.Mail = {
        find: jest
          .fn()
          .mockResolvedValue([
            { email: "user1@example.com" },
            { email: "user2@example.com" },
          ]),
      };

      // Make a POST request to the endpoint with CSRF token included in headers
      const response = await request(app)
        .post("/allMail")
        .send({
          subject: "Test Subject",
          content: "<b>Test Content</b>",
        })
        .set("Cookie", `csrfToken=${csrfToken}`);

      // Assert response status
      expect(response.status).toBe(200);

      // Assert that nodemailer's sendMail function was called for each user
      expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(2);

      // Assert response message
      expect(response.text).toBe("Mail sent successfully");
    });
  });

  describe("POST /newsletterMail", () => {
    test("should send mail to all subscribers", async () => {
      // Fetch CSRF token
      const csrfResponse = await request(app).get("/csrf-token");
      const csrfToken = csrfResponse.body.csrfToken;

      // Mock the model's behavior
      mailController.Mail = {
        find: jest
          .fn()
          .mockResolvedValue([
            { mail: "subscriber1@example.com" },
            { mail: "subscriber2@example.com" },
          ]),
      };

      // Make a POST request to the endpoint with CSRF token included in headers
      const response = await request(app)
        .post("/newsletterMail")
        .send({
          subject: "Newsletter Subject",
          content: "<b>Newsletter Content</b>",
        })
        .set("Cookie", `csrfToken=${csrfToken}`);

      // Assert response status
      expect(response.status).toBe(200);

      // Assert that nodemailer's sendMail function was called for each subscriber
      expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(2);

      // Assert response message
      expect(response.text).toBe("Mail sent successfully");
    });
  });
});
