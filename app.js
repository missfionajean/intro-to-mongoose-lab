/* ----------------------------------------------------------- */
/* ------------------- Importing Packages -------------------- */
/* ----------------------------------------------------------- */

// importing locally defined model (must start with "./")
const CRM = require("./models/customer.js");

// setting up dot env for use
const dotenv = require("dotenv");
dotenv.config();

// setting up mongoose for use
const mongoose = require("mongoose");

// imports prompt-sync package
const prompt = require("prompt-sync")();

/* ----------------------------------------------------------- */
/* ------------------- Database Connection ------------------- */
/* ----------------------------------------------------------- */

// async that connects, runs query function, disconnects, exits
const connect = async () => {
	// connect to MongoDB using MONGODB_URI in our .env file.
	await mongoose.connect(process.env.MONGODB_URI);

	// call runQueries(), which interacts with data in our db
	await runQueries();
};

// calls function so it actually does something
connect();

/* ----------------------------------------------------------- */
/* ------------------------ Functions ------------------------ */
/* ----------------------------------------------------------- */

const menuChoice = () => {
	console.log("Welcome to the CRM. What would you like to do?\n");
	console.log("1. Create Customer");
	console.log("2. View Customers");
	console.log("3. Update Customer");
	console.log("4. Delete Customer");
	console.log("5. Quit\n");
	console.log("[Select a # from the list and press ENTER]");
	return prompt("> ");
};

const runQueries = async () => {
	switch (menuChoice()) {
		case "1":
			addCust();
			break;
		case "2":
			viewCust();
			break;
		case "3":
			updateCust();
			break;
		case "4":
			deleteCust();
			break;
		case "5":
			exitCRM();
			break;
	}
};

const addCust = async () => {
    
	await CRM.create(newinfo);
	console.log();
};

const viewCust = async () => {
	await CRM.find({});
	console.log();
};

const updateCust = async () => {
	await CRM.findOneAndUpdate(findinfo, newinfo, { new: true });
	console.log();
};

const deleteCust = async () => {
	await CRM.findOneAndDelete(findinfo);
	console.log();
};

const exitCRM = async () => {
	// disconnect our app from MongoDB after our queries run
	await mongoose.disconnect();

	// closes app, bringing us back to the command line
	process.exit();
};
