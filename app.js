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
	console.log("\nWelcome to the CRM. What would you like to do?\n");
	console.log("1. Create Customer");
	console.log("2. View Customers");
	console.log("3. Update Customer");
	console.log("4. Delete Customer");
	console.log("5. Quit\n");
	console.log("[Select a # and press ENTER]");
	return prompt("> ");
};

const runQueries = async () => {
	switch (menuChoice()) {
		case "1":
			await addCust();
			break;
		case "2":
			await viewCust();
			break;
		case "3":
			await updateCust();
			break;
		case "4":
			await deleteCust();
			break;
		case "5":
			await exitCRM();
			break;
		default:
			await runQueries();
			break;
	}
};

// display entries to user to catch and correct errors
const checkEntry = async (entry) => {
	console.log(`\nIs this info correct?`);
	console.log(`${entry.FIRSTNAME}`);
	console.log(`${entry.LASTNAME}`);
	console.log(`${entry.AGE}\n`);

	console.log("1. Yes - Add to database");
	console.log("2. No - Enter info again");
	console.log("3. Back to menu\n");
	console.log("[Select a # and press ENTER]");

	// switch statement
	switch (prompt("> ")) {
		case "1":
			await CRM.create(entry);
			break;
		case "2":
			await addCust();
			break;
		case "3":
			await runQueries();
			break;
	}
};

const addCust = async () => {
	// sets up object according to schema
	const customerData = {
		FIRSTNAME: "",
		LASTNAME: "",
		AGE: 0,
	};

	// loop to gather inputs for customerData schema
	for (const info in customerData) {
		console.log(`Please type customer's ${info}\n`);
		console.log("[Press ENTER when finished]");
		customerData[info] = prompt("> ").trim();
	}

	// checks entry and routes to correct function
	await checkEntry(customerData);
	console.log("Entry complete!\n");
	console.log("Please choose another option");
	await runQueries();
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
