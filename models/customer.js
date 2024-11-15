// imprts mongoose into file
const mongoose = require("mongoose");

// defines schema for this collection (instructional object)
const customerSchema = new mongoose.Schema({
	// "key: value" pairs
	FIRSTNAME: String,
    LASTNAME: String,
	AGE: Number,
});

// compiles schema into model (necessary for MongoDB interaction)
const CRM = mongoose.model("CRM", customerSchema);

// exports model to access in other parts of app (using require)
module.exports = CRM;
