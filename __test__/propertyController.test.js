const request = require("supertest");
const { app } = require("../server");
const propertyModel = require("../models/property_model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

describe("GET /all", () => {
  test("should return all properties", async () => {
    // Mocking the data returned by the database
    const mockProperties = [
      { name: "Property 1", price: 100000, location: "Location 1" },
      { name: "Property 2", price: 200000, location: "Location 2" },
    ];

    // Mocking the behavior of the propertyModel.Property.find() method
    propertyModel.Property.find = jest.fn().mockResolvedValue(mockProperties);

    // Making the request to the /all route
    const response = await request(app).get("/properties/all");

    // Asserting the response status code
    expect(response.status).toBe(200);

    // Asserting that the response body matches the mock data
    expect(response.body).toEqual(mockProperties);
  });
});
