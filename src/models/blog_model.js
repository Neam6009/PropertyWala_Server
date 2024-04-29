const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
	title: {
		type: String,
		required: [true, "blog title is required"],
	},
	content: String,
	blogAuthor: String,
	blog_user_id: String,
	date: String,
	blogImage: String,
});

const Blog = new mongoose.model("blog", blogSchema);

module.exports = {
	blogSchema,
	Blog,
};
