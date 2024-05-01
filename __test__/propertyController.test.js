const request = require("supertest");

const { app } = require("../server");

describe("testing api is live", () => {
  test("checking api is live", (done) => {
    request(app)
      .get("/test")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  }, 15000);
});

const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");
const propertyModel = require("../models/property_model");
const userModel = require("../models/user_model");
const bcrypt = require("bcryptjs");

describe("Property Controller Tests", () => {
  beforeAll(async () => {
    // Connect to MongoDB before running tests
    await mongoose.connect("your_test_mongodb_uri", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  });

  afterAll(async () => {
    // Disconnect from MongoDB after running tests
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Populate the test database with some dummy data before each test
    await propertyModel.Property.create([
      {
        name: "Property 1",
        price: 100000,
        location: "Location 1",
        bedsNum: 2,
        bathsNum: 1,
        area: 1000,
        purpose: "rent",
        description: "Description 1",
        parkingArea: "Parking Area 1",
        propertyType: "Type 1",
        propertyImage: [],
        yearBuilt: 2000,
        lotSize: 5000,
        lister: {
          name: "Lister 1",
          description: "Lister Description 1",
          relation: "Relation 1",
          mobileNumber: "Mobile Number 1",
          email: "lister1@example.com",
        },
        user_id: "user_id_1",
      },
      {
        name: "Property 2",
        price: 200000,
        location: "Location 2",
        bedsNum: 3,
        bathsNum: 2,
        area: 1500,
        purpose: "sale",
        description: "Description 2",
        parkingArea: "Parking Area 2",
        propertyType: "Type 2",
        propertyImage: [],
        yearBuilt: 2010,
        lotSize: 6000,
        lister: {
          name: "Lister 2",
          description: "Lister Description 2",
          relation: "Relation 2",
          mobileNumber: "Mobile Number 2",
          email: "lister2@example.com",
        },
        user_id: "user_id_2",
      },
    ]);

    await userModel.User.create([
      {
        _id: "user_id_1",
        email: "user1@example.com",
        password: bcrypt.hashSync("password1", 10),
        wishlist: [],
      },
      {
        _id: "user_id_2",
        email: "user2@example.com",
        password: bcrypt.hashSync("password2", 10),
        wishlist: ["property_id_1"],
      },
    ]);
  });

  afterEach(async () => {
    // Clean up the test database after each test
    await propertyModel.Property.deleteMany({});
    await userModel.User.deleteMany({});
  });

  describe("GET /all", () => {
    test("should get all properties", async () => {
      const response = await request(app).get("/all");
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2); // Assuming 2 properties were added in the beforeEach block
    });
  });

  describe("GET /user/:id", () => {
    test("should get properties by user ID", async () => {
      const userId = "user_id_1"; // Assuming user_id_1 exists in the test database
      const response = await request(app).get(`/user/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1); // Assuming 1 property belongs to user_id_1
    });
  });

  describe("GET /getWishlist/:uid", () => {
    test("should get wishlist by user ID", async () => {
      const userId = "user_id_2"; // Assuming user_id_2 exists in the test database
      const response = await request(app).get(`/getWishlist/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1); // Assuming user_id_2 has 1 property in the wishlist
    });
  });

  describe("GET /checkWishlist/:uid/:pid", () => {
    test("should check if property exists in user's wishlist", async () => {
      const userId = "user_id_2"; // Assuming user_id_2 exists in the test database
      const propertyId = "property_id_1"; // Assuming property_id_1 exists in the test database
      const response = await request(app).get(
        `/checkWishlist/${userId}/${propertyId}`
      );
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true); // Assuming property_id_1 exists in the wishlist of user_id_2
    });
  });
});
