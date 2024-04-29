const mongoose = require("mongoose");

const listerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "owner name is required"],
	},
	description: String,
	relation: String,
	mobileNumber: Number,
	email: String,
});

const propertySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "property name is required!"],
	},
	price: Number,
	location: String,
	locality: String,
	bedsNum: Number,
	bathsNum: Number,
	availability: {
		type: String,
		default: "Active",
	},
	area: Number,
	purpose: String,
	description: String,
	parkingArea: String,
	propertyImage: [String],
	propertyType: String,
	certified: String,
	yearBuilt: {
		type: Number,
		min: 1900,
		max: 2023,
	},
	lotSize: String,
	lister: listerSchema,
	user_id: String,
});

const Property = new mongoose.model("Property", propertySchema);

module.exports = {
	Property,
	propertySchema,
	listerSchema,
};
