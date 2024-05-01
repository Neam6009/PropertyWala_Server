const express = require("express");
const blogController = require("../controllers/blogs");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: API endpoints for Blogs
 */

/**
 * @swagger
 * /blogs/all:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blog]
 *     responses:
 *       '200':
 *         description: All blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       '400':
 *         description: Bad request or error retrieving blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Internal server error
 */
router.get("/all", blogController.getAllBlogs);

/**
 * @swagger
 * /blogs/insert:
 *   post:
 *     summary: Insert a new blog
 *     tags: [Blog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blog:
 *                 type: object
 *                 properties:
 *                   blogTitle:
 *                     type: string
 *                   blogContent:
 *                     type: string
 *               image:
 *                 type: string
 *               user:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   _id:
 *                     type: string
 *     responses:
 *       '200':
 *         description: Blog uploaded successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Blog uploaded
 *       '400':
 *         description: Bad request or error uploading the blog
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Internal server error
 */
router.post("/insert", blogController.insertBlog);

/**
 * @swagger
 * /blogs/deleteBlog/{id}:
 *   post:
 *     summary: Delete a blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to delete
 *     responses:
 *       '200':
 *         description: Blog deleted successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Blog deleted
 *       '500':
 *         description: Internal server error
 */
router.post("/deleteBlog/:id", blogController.removeBlog);
module.exports = router;
