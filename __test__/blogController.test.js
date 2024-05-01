const request = require("supertest");
const { app } = require("../server");
const blogModel = require("../models/blog_model");

describe("GET /all", () => {
  test("should return all blogs", async () => {
    // Mocking the data returned by the database
    const mockBlogs = [
      { title: "Blog 1", content: "Content 1" },
      { title: "Blog 2", content: "Content 2" },
      { title: "Blog 3", content: "Content 3" },
    ];

    // Mocking the behavior of the blogModel.Blog.find() method
    blogModel.Blog.find = jest.fn().mockResolvedValue(mockBlogs);

    // Making the request to the /all route
    const response = await request(app).get("/blogs/all");

    // Asserting the response status code
    expect(response.status).toBe(200);

    // Asserting that the response body matches the mock data
    expect(response.body).toEqual(mockBlogs);
  });
});

// describe("POST /insert", () => {
//   test("should insert a blog", async () => {
//     // Mocking request body
//     const requestBody = {
//       blog: {
//         blogTitle: "Test Blog Title",
//         blogContent: "Test Blog Content",
//       },
//       image: "test_image_url",
//       user: {
//         name: "Test User",
//         _id: "test_user_id",
//       },
//     };

//     // Mocking the behavior of blogModel.Blog.create() method
//     blogModel.Blog.create = jest.fn().mockResolvedValue();

//     // Fetch CSRF token
//     const csrfResponse = await request(app).get("/csrf-token");
//     const csrfToken = csrfResponse.body.csrfToken;
//     console.log(csrfResponse.body.csrfToken);

//     // Making the request to the /insert route with CSRF token included in headers
//     const response = await request(app)
//       .post("/blogs/insert")
//       .set("Cookie", `csrfToken=${csrfToken}`)
//       .send(requestBody);

//     // Asserting the response status code
//     expect(response.status).toBe(200);

//     // Asserting that the blogModel.Blog.create() method was called with the correct parameters
//     expect(blogModel.Blog.create).toHaveBeenCalledWith({
//       title: requestBody.blog.blogTitle,
//       content: requestBody.blog.blogContent,
//       blogAuthor: requestBody.user.name,
//       blog_user_id: requestBody.user._id,
//       date: expect.any(String), // Assuming date format is correct
//       blogImage: requestBody.image,
//     });

//     // Asserting the response message
//     expect(response.text).toBe("Blog uploaded");
//   });
// });
