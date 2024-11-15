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

// importing process package
const process = require("process");

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
	console.log("2. Search - View, Update or Delete");
	console.log("3. Quit\n");
	console.log("[Select a # and press ENTER]");
	return prompt("> ").trim();
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
			await exitCRM();
			break;
		default:
			console.log("Invalid selection. Please select a valid option!");
			await runQueries();
			break;
	}
};

// display entries to user to catch and correct errors
const checkEntry = async (entry, action, id = "N/A") => {
	console.log(`\nIs this info correct?`);
	console.log(`First: ${entry.FIRSTNAME}`);
	console.log(`Last: ${entry.LASTNAME}`);
	console.log(`Age: ${entry.AGE}\n`);

	console.log("1. Yes - Add to database");
	console.log("2. No - Enter info again");
	console.log("3. Back to menu\n");
	console.log("[Select a # and press ENTER]");

	// switch statement
	switch (prompt("> ").trim()) {
		case "1":
			if (action === "create") {
				await CRM.create(entry);
			} else if (action === "update") {
				await CRM.findByIdAndUpdate(id, entry, { new: true });
			}
			break;
		case "2":
			if (action === "create") {
				await addCust();
			} else if (action === "update") {
				await getUpdates();
			}
			break;
		case "3":
			await runQueries();
			break;
		default:
			console.log("Invalid selection. Please select a valid option!");
			await checkEntry(entry, action, id);
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
		customerData[info] = prompt("> ").trim().toLowerCase();
	}

	// routes to checkEntry (action argument "create")
	await checkEntry(customerData, "create");

	// if successful, notifies user and routes to main menu
	console.log("Entry complete! Please choose another option:");
	await runQueries();
};

const viewCust = async () => {
	console.log("Filter customers by:\n");
	console.log("1. Name");
	console.log("2. Age");
	console.log("3. Customer ID");
	console.log("4. View All");
	console.log("5. Back to menu\n");
	console.log("[Select a # and press ENTER]");

	let result = "";

	// switch statement
	switch (prompt("> ").trim()) {
		case "1":
			console.log("Please type customer's FIRSTNAME\n");
			console.log("[Press ENTER when finished]");
			const first = prompt("> ").trim().toLowerCase();
			console.log("Please type customer's LASTNAME\n");
			console.log("[Press ENTER when finished]");
			const last = prompt("> ").trim().toLowerCase();
			try {
				result = await CRM.find({ FIRSTNAME: first, LASTNAME: last });
				if (result.length === 0) {
					throw "Not found";
				}
			} catch (err) {
				console.log("No matching customer found!");
				await updateCust();
			}
			break;
		case "2":
			console.log("Please type customer's AGE\n");
			console.log("[Press ENTER when finished]");
			const age = prompt("> ");
			try {
				result = await CRM.find({ AGE: age });
				if (result.length === 0) {
					throw "Not found";
				}
			} catch (err) {
				console.log("No matching customer found!");
				await updateCust();
			}
			break;
		case "3":
			console.log("Please type customer's UNIQUE ID\n");
			console.log("[Press ENTER when finished]");
			const custID = prompt("> ");
			try {
				result = await CRM.findById(custID);
				if (result.length === 0) {
					throw "Not found";
				}
			} catch (err) {
				console.log("No matching customer found!");
				await updateCust();
			}
			break;
		case "4":
			result = await CRM.find({});
			break;
		case "5":
			await runQueries();
			break;
		default:
			console.log("Invalid selection. Please select a valid option!");
			await viewCust();
			break;
	}

	// displays search results to user before moving on
	readDB(result);

	// provided they perform a valid search, directs them to update menu
	updateCust();
};

const getUpdates = async () => {
	// grabs single customer and shows it to user
	console.log("Please type customer's UNIQUE ID\n");
	console.log("[Press ENTER when finished]");
	const custID = prompt("> ").trim();

	// defining customer variable to prevent scope issue
	let customer = "";

	// error handling
	try {
		customer = await CRM.findById(custID);
	} catch (err) {
		console.log("No matching customer found!");
		await updateCust();
	}

	// displays file to be updated
	console.log("\nCustomer to be updated:");
	console.log(
		`ID: ${customer.id} -- Name: ${customer.FIRSTNAME} ${customer.LASTNAME}, Age: ${customer.AGE}\n`
	);

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
		customerData[info] = prompt("> ").trim().toLowerCase();
	}

	// runs checkEntry() with action argument as "update"
	await checkEntry(customerData, "update", custID);

	// if successful, notifies user and routes to main menu
	console.log("Update complete! Please choose another option:");
	await runQueries();
};

// nest inside view customer for usability (ask after viewing - update? enter userid, enter new info, check entry, back to menu)
const updateCust = async () => {
	console.log("\nWhat would you like to do next?\n");
	console.log("1. New Search");
	console.log("2. Create Customer");
	console.log("3. Update Customer");
	console.log("4. Delete Customer");
	console.log("5. Back to menu\n");
	console.log("[Select a # and press ENTER]");

	// switch statement
	switch (prompt("> ").trim()) {
		case "1":
			await viewCust();
			break;
		case "2":
			await addCust();
			break;
		case "3":
			// routes to getUpdates(), which is recursive
			await getUpdates();
			break;
		case "4":
			await deleteCust();
			break;
		case "5":
			await runQueries();
			break;
		default:
			console.log("Invalid selection. Please select a valid option!\n");
			await updateCust();
			break;
	}
};

const deleteCust = async () => {
	// grabs single customer and shows it to user
	console.log("Please type customer's UNIQUE ID\n");
	console.log("[Press ENTER when finished]");
	const custID = prompt("> ").trim();

	let customer = "";

	// error handling
	try {
		customer = await CRM.findById(custID);
	} catch (err) {
		console.log("No matching customer found!");
		await updateCust();
	}

	// double-checks deletion to be sure
	console.log(`\nDelete this customer?`);
	console.log(
		`ID: ${customer.id} -- Name: ${customer.FIRSTNAME} ${customer.LASTNAME}, Age: ${customer.AGE}`
	);
	console.log("\n1. Yes - Delete");
	console.log("2. No - Re-enter ID");
	console.log("3. Back to menu\n");
	console.log("[Select a # and press ENTER]");

	// switch statement
	switch (prompt("> ").trim()) {
		case "1":
			// deletes single entry matching entered ID
			await CRM.findByIdAndDelete(custID);
			break;
		case "2":
			await deleteCust();
			break;
		case "3":
			await runQueries();
			break;
		default:
			console.log("Invalid selection. Please try again:\n");
			await deleteCust();
			break;
	}

	// if successful, notifies user and routes to main menu
	console.log("Customer deleted! Please choose another option:");
	await runQueries();
};

const exitCRM = async () => {
	// disconnect our app from MongoDB after our queries run
	await mongoose.disconnect();

	// closes app, bringing us back to the command line
	process.exit(0);
};

async function readDB(data) {
	try {
		data.forEach((item) => {
			console.log(
				`ID: ${item.id} -- Name: ${item.FIRSTNAME} ${item.LASTNAME}, Age: ${item.AGE}`
			);
		});
	} catch (err) {
		console.log(
			`ID: ${data.id} -- Name: ${data.FIRSTNAME} ${data.LASTNAME}, Age: ${data.AGE}`
		);
	}
}
