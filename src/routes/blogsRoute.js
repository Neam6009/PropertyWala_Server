const express = require("express");
const blogController = require("../controllers/blogs");
const router = express.Router();
router.get("/all", blogController.getAllBlogs);
router.post("/insert", blogController.insertBlog);
router.post("/deleteBlog/:id", blogController.removeBlog);
module.exports = router;
